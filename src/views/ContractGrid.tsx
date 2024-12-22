import React from 'react'
import { AmountDisplay } from '../AmountDisplay'

import {
    useGetAccountsQuery,
    useGetCategorysQuery,
    useGetContractsQuery,
} from '../app/api'
import { CategoryDisplay } from '../CategoryDisplay'
import { Box } from '@mui/material'
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
import { PAYMENT_CYCLES } from '../input/PaymentCycleInput'
import { round } from 'lodash'
import {Account, Category, Contract} from "../app/types";

const ContractGridToolbar = ({}) => {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarColumnsButton />
        </GridToolbarContainer>
    )
}

interface ContractGridProps {
    filterModel?: GridFilterModel
}

export const ContractGrid = ({
    filterModel: initialFilterModel,
}: ContractGridProps) => {
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

    const columns: GridColDef<Contract>[] = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'string',
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 100,
            type: 'string',
            renderCell: ({ value, id, row }) => (
                <Link to={`/contracts/${id}/`}>{value}</Link>
            ),
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
            }: GridCellParams<Contract>) => {
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
            field: 'amount_per_year',
            headerName: 'Betrag pro Jahr',
            renderCell: ({ value }) => <AmountDisplay value={value} />,
            type: 'number',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'amount_per_month',
            headerName: 'Betrag pro Monat',
            valueGetter: (_, row) => round(row.amount_per_year / 12.0, 2),
            renderCell: ({ value }) => <AmountDisplay value={value} />,
            type: 'number',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'amount',
            headerName: 'Betrag',
            renderCell: ({ value }) =>
                value ? <AmountDisplay value={value} /> : null,
            type: 'number',
            minWidth: 100,
            aggregable: false,
        },
        {
            field: 'payment_cycle',
            headerName: 'Turnus',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            valueOptions: PAYMENT_CYCLES,
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
        },
        {
            field: 'cancelation_period',
            headerName: 'Kündigungsfrist',
            flex: 1,
            type: 'number',
        },
        {
            field: 'minimum_duration',
            headerName: 'Mindestvertragslaufzeit',
            flex: 1,
            type: 'number',
        },
        {
            field: 'renewal_duration',
            headerName: 'Verlängerung',
            flex: 1,
            type: 'number',
        },
        {
            field: 'is_active',
            headerName: 'Aktiv',
            flex: 1,
            type: 'boolean',
        },

        {
            field: 'date_start',
            headerName: 'Start',
            flex: 1,
            minWidth: 100,
            type: 'date',
            valueFormatter: (value) =>
                value ? dayjs(value).format('DD.MM.YYYY') : '',
        },
        {
            field: 'payment_date',
            headerName: 'Abbuchungstag',
            flex: 1,
            minWidth: 100,
            type: 'date',
            valueFormatter: (value) =>
                value ? dayjs(value).format('DD.MM.YYYY') : '',
        },
    ]

    const isLoading =
        accountQueryState.isLoading ||
        contractQueryState.isLoading ||
        categoryQueryState.isLoading

    const rows = (contracts ?? []).map(
        ({ date_start, payment_date, ...rest }: Contract) => ({
            date_start: dayjs(date_start, 'YYYY-MM-DD').toDate(),
            payment_date: dayjs(payment_date, 'YYYY-MM-DD').toDate(),
            ...rest,
        }),
    )

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
                    toolbar: ContractGridToolbar,
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            account: false,
                            date_start: false,
                            payment_date: false,
                            is_active: false,
                            amount_per_year: false,
                            cancelation_period: false,
                            minimum_duration: false,
                            renewal_duration: false,
                        },
                    },
                    aggregation: {
                        model: {
                            amount_per_month: 'sum',
                        },
                    },
                }}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
            />
        </Box>
    )
}
