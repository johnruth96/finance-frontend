import React, { Dispatch, SetStateAction } from 'react'
import { AmountDisplay } from '../../core/AmountDisplay'

import {
    useGetAccountsQuery,
    useGetCategorysQuery,
    useGetContractsQuery,
    useGetRecordsQuery,
} from '../../app/api'
import { CategoryDisplay } from '../../categories/CategoryDisplay'
import { Box, Button } from '@mui/material'
import {
    DataGridPremium,
    GridCellParams,
    GridColDef,
    GridFilterModel,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarFilterButton,
} from '@mui/x-data-grid-premium'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import {Account, Category, Contract, RecordType} from "../../app/types";

interface RecordGridToolbar {
    onFilterModelChange: Dispatch<SetStateAction<GridFilterModel>>
}

const RecordGridToolbar = ({ onFilterModelChange }: RecordGridToolbar) => {
    const handleCurrenMonthClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({ field }) => field !== 'date',
            )
            items.push({
                field: 'date',
                operator: 'onOrAfter',
                value: dayjs().startOf('month').toDate(),
            })
            items.push({
                field: 'date',
                operator: 'onOrBefore',
                value: dayjs().endOf('month').toDate(),
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    const handleLastMonthClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({ field }) => field !== 'date',
            )
            items.push({
                field: 'date',
                operator: 'onOrAfter',
                value: dayjs().subtract(1, 'month').startOf('month').toDate(),
            })
            items.push({
                field: 'date',
                operator: 'onOrBefore',
                value: dayjs().subtract(1, 'month').endOf('month').toDate(),
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    const handleIncomeClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({ field }) => field !== 'amount',
            )
            items.push({
                field: 'amount',
                operator: '>',
                value: 0,
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    const handleExpenseClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({ field }) => field !== 'amount',
            )
            items.push({
                field: 'amount',
                operator: '<',
                value: 0,
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarColumnsButton />
            <Button size={'small'} onClick={handleCurrenMonthClick}>
                Aktueller Monat
            </Button>
            <Button size={'small'} onClick={handleLastMonthClick}>
                Letzter Monat
            </Button>
            <Button size={'small'} onClick={handleIncomeClick}>
                Einnahmen
            </Button>
            <Button size={'small'} onClick={handleExpenseClick}>
                Ausgaben
            </Button>
        </GridToolbarContainer>
    )
}

interface RecordGridViewProps {
    filterModel?: GridFilterModel
}

export const RecordGridView = ({
    filterModel: initialFilterModel,
}: RecordGridViewProps) => {
    const { data: records, ...recordQueryState } = useGetRecordsQuery()
    const { data: contracts, ...contractQueryState } = useGetContractsQuery()
    const { data: categories, ...categoryQueryState } = useGetCategorysQuery()
    const { data: accounts, ...accountQueryState } = useGetAccountsQuery()

    const getInitialFilterModel = () => {
        if (initialFilterModel) {
            return initialFilterModel
        } else {
            return { items: [] } as GridFilterModel
        }
    }

    const [filterModel, setFilterModel] = React.useState<GridFilterModel>(
        getInitialFilterModel,
    )

    const columns: GridColDef<RecordType>[] = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'string',
            aggregable: false,
        },
        {
            field: 'amount',
            headerName: 'Betrag',
            renderCell: ({ value }) => <AmountDisplay value={value} />,
            type: 'number',
            minWidth: 100,
        },
        {
            field: 'subject',
            headerName: 'Betreff',
            flex: 1,
            minWidth: 100,
            type: 'string',
            aggregable: false,
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
        },
        {
            field: 'date',
            headerName: 'Datum',
            flex: 1,
            minWidth: 100,
            type: 'date',
            valueFormatter: (value) => {
                if (value) {
                    return dayjs(value).format('DD.MM.YYYY')
                } else {
                    return ''
                }
            },
            aggregable: false,
        },
        {
            field: 'date_created',
            headerName: 'Erstellt am',
            flex: 1,
            minWidth: 100,
            type: 'dateTime',
            valueFormatter: (value) => {
                if (value) {
                    return dayjs(value).format('DD.MM.YYYY HH:mm')
                } else {
                    return ''
                }
            },
            aggregable: false,
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
            aggregable: false,
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
            aggregable: false,
        },
        {
            field: 'transaction_count',
            headerName: 'Transaktionen',
            flex: 1,
            minWidth: 100,
            type: 'number',
            valueGetter: (_, row) => row.transactions.length,
            aggregable: true,
        },
    ]

    const isLoading =
        recordQueryState.isLoading ||
        accountQueryState.isLoading ||
        contractQueryState.isLoading ||
        categoryQueryState.isLoading

    const rows = (records ?? []).map(({ date, ...rest }: RecordType) => ({
        date: dayjs(date, 'YYYY-MM-DD').toDate(),
        ...rest,
    }))

    return (
        <Box sx={{ width: '100%' }}>
            <DataGridPremium
                rows={rows}
                columns={columns}
                autoHeight={true}
                density={'compact'}
                loading={isLoading}
                pagination={true}
                slots={{
                    toolbar: RecordGridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        onFilterModelChange: setFilterModel,
                    },
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            contract: false,
                            account: false,
                            date_created: false,
                            transaction_count: false,
                        },
                    },
                    aggregation: {
                        model: {
                            amount: 'sum',
                        },
                    },
                }}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
            />
        </Box>
    )
}
