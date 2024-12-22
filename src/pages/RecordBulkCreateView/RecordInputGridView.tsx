import { GridRowModel } from '@mui/x-data-grid/models/gridRows'
import { Account, Category, Contract, RecordType } from '../../finance/app/types'
import React, { SetStateAction } from 'react'
import {
    useGetAccountsQuery,
    useGetCategorysQuery,
    useGetContractsQuery,
} from '../../finance/app/api'
import {
    DataGridPremium,
    GridActionsCellItem,
    GridCellParams,
    GridColDef,
    GridRenderEditCellParams,
    GridRowId,
    GridRowModesModel,
    GridSlots,
    useGridApiContext,
} from '@mui/x-data-grid-premium'
import { AmountDisplay } from '../../AmountDisplay'
import { Link } from 'react-router-dom'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import dayjs from 'dayjs'
import { CategoryDisplay } from '../../CategoryDisplay'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box } from '@mui/material'
import { Toolbar } from './Toolbar'
import { CategorySelectComponent } from '../../input/CategorySelect'

interface RecordInputGridViewProps {
    rowModel: GridRowModel<RecordType>[]
    onRowModelChange: React.Dispatch<SetStateAction<GridRowModel<RecordType>[]>>
}

const CategoryEditCell = ({
    id,
    categories,
    value,
    field,
}: GridRenderEditCellParams) => {
    const apiRef = useGridApiContext()

    const handleValueChange = (value: string) => {
        apiRef.current.setEditCellValue({ id, field, value: +value })
    }

    return (
        <CategorySelectComponent
            objects={categories}
            value={value}
            onChange={handleValueChange}
            disableMain
            sx={{ width: '100%' }}
        />
    )
}

export const RecordInputGridView = ({
    rowModel,
    onRowModelChange,
}: RecordInputGridViewProps) => {
    const { data: contracts, ...contractQueryState } = useGetContractsQuery()
    const { data: categories, ...categoryQueryState } = useGetCategorysQuery()
    const { data: accounts, ...accountQueryState } = useGetAccountsQuery()

    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {},
    )

    const processRowUpdate = (newRow: GridRowModel<RecordType>) => {
        const updatedRow = { ...newRow, isNew: false }
        onRowModelChange(
            rowModel.map((row) => (row.id === newRow.id ? updatedRow : row)),
        )
        return updatedRow
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        onRowModelChange(rowModel.filter((row) => row.id !== id))
    }

    const columns: GridColDef<RecordType>[] = [
        {
            field: 'amount',
            headerName: 'Betrag',
            renderCell: ({ value }) => <AmountDisplay value={value} />,
            type: 'number',
            minWidth: 100,
            editable: true,
        },
        {
            field: 'subject',
            headerName: 'Betreff',
            flex: 1,
            minWidth: 100,
            type: 'string',
            renderCell: ({ value, id, row }) => (
                <span>
                    <Link to={`/records/${id}/update/`}>{value}</Link>
                    {row.counter_booking && (
                        <span>
                            {' '}
                            (<InsertLinkIcon /> {row.counter_booking})
                        </span>
                    )}
                </span>
            ),
            editable: true,
        },
        {
            field: 'date',
            headerName: 'Datum',
            flex: 1,
            minWidth: 100,
            type: 'date',
            valueFormatter: (value) =>
                value ? dayjs(value).format('DD.MM.YYYY') : '',
            editable: true,
        },
        {
            field: 'category',
            headerName: 'Kategorie',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            display: 'flex',
            valueOptions: (categories ?? []).map(
                ({ id, name, ...rest }: Category) => ({
                    value: id,
                    label: name,
                    ...rest,
                }),
            ),
            renderEditCell: (params) => {
                return <CategoryEditCell categories={categories} {...params} />
            },
            renderCell: ({
                value,
                colDef,
                formattedValue,
            }: GridCellParams<RecordType>) => {
                const valueOption = colDef.valueOptions.find(
                    (option) => option.value === value,
                )

                if (value) {
                    return (
                        <CategoryDisplay
                            color={valueOption?.color ?? 'red'}
                            name={formattedValue}
                            variant={'body2'}
                        />
                    )
                } else {
                    return null
                }
            },
            editable: true,
        },
        {
            field: 'contract',
            headerName: 'Vertrag',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            valueOptions: (contracts ?? []).map(({ id, name }: Contract) => ({
                value: id,
                label: name,
            })),
            editable: true,
        },
        {
            field: 'account',
            headerName: 'Konto',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            valueOptions: (accounts ?? []).map(({ id, name }: Account) => ({
                value: id,
                label: name,
            })),
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ]
            },
        },
    ]

    const isLoading =
        accountQueryState.isLoading ||
        contractQueryState.isLoading ||
        categoryQueryState.isLoading

    return (
        <Box sx={{ width: '100%' }}>
            <DataGridPremium
                rows={rowModel}
                columns={columns}
                autoHeight={true}
                density={'compact'}
                loading={isLoading}
                editMode={'row'}
                slots={{
                    toolbar: Toolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: {
                        setRows: onRowModelChange,
                        setRowModesModel,
                    },
                }}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
            />
        </Box>
    )
}
