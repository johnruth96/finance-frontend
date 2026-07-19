import {GridCellParams, GridColDef, GridRenderEditCellParams} from "@mui/x-data-grid-premium";
import {Account, Category, Contract} from "../../app/types";
import {AmountDisplay} from "../../core/AmountDisplay";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import {CategoryDisplayContainer} from "../../categories/CategoryDisplay";
import React from "react";
import {RowModel} from "./BaseRecordGrid";
import {
    getGridDateFilterOperators,
    getGridNumericFilterOperators,
    getGridSingleSelectFilterOperators,
    getGridStringFilterOperators
} from "../../app/url";
import {CategorySelect} from "../../categories/CategorySelect";
import {ContractSelect} from "../../contracts/ContractSelect";

const CategoryEditCell = ({id, field, value, api}: GridRenderEditCellParams<RowModel>) => (
    <CategorySelect
        value={value}
        onChange={(val) => api.setEditCellValue({id, field, value: val})}
        sx={{width: "100%"}}
    />
)

const ContractEditCell = ({id, field, value, api}: GridRenderEditCellParams<RowModel>) => (
    <ContractSelect
        value={value}
        onChange={(val) => api.setEditCellValue({id, field, value: val})}
        sx={{width: "100%"}}
        variant={"standard"}
    />
)

export const createGridColDef = (categories: Category[] | undefined, contracts: Contract[] | undefined, accounts: Account[] | undefined): GridColDef<RowModel>[] => {
    return [
        {
            field: 'id',
            headerName: 'ID',
            type: 'string',
            aggregable: false,
            filterOperators: getGridStringFilterOperators().filter(op => op.value === "equals"),
        },
        {
            field: 'amount',
            headerName: 'Betrag',
            renderCell: ({value}) => <AmountDisplay value={value}/>,
            type: 'number',
            minWidth: 100,
            editable: true,
            filterOperators: getGridNumericFilterOperators(),
        },
        {
            field: 'subject',
            headerName: 'Betreff',
            flex: 1,
            minWidth: 100,
            type: 'string',
            aggregable: false,
            editable: true,
            renderCell: ({value, id}) => (
                <Link to={`/records/${id}/`}>{value}</Link>
            ),
            filterOperators: getGridStringFilterOperators(),
        },
        {
            field: 'date',
            headerName: 'Datum',
            flex: 1,
            minWidth: 100,
            type: 'date',
            editable: true,
            valueFormatter: (value) => {
                if (value) {
                    return dayjs(value).format('DD.MM.YYYY')
                } else {
                    return ''
                }
            },
            aggregable: false,
            filterOperators: getGridDateFilterOperators(),
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
            filterOperators: getGridDateFilterOperators(true),
        },
        {
            field: 'category',
            headerName: 'Kategorie',
            flex: 2,
            minWidth: 100,
            type: 'singleSelect',
            display: 'flex',
            editable: true,
            valueOptions: (categories ?? []).map(category => ({label: category.name, value: category.id})),
            renderCell: ({value}: GridCellParams<RowModel>) => {
                if (typeof value === "number") {
                    return <CategoryDisplayContainer id={value} variant={"body2"}/>
                } else {
                    return null
                }
            },
            renderEditCell: (params) => <CategoryEditCell {...params}/>,
            filterOperators: getGridSingleSelectFilterOperators(),
        },
        {
            field: 'contract',
            headerName: 'Vertrag',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            aggregable: false,
            editable: true,
            valueOptions: (contracts ?? []).map(contract => ({label: contract.name, value: contract.id})),
            /*renderCell: ({value}: GridCellParams<RowModel>) => {
                const contract = (contracts ?? []).find(
                    (contract) => contract.id === value,
                )

                return contract?.name ?? ""
            },*/
            renderEditCell: (params) => <ContractEditCell {...params}/>,
            filterOperators: getGridSingleSelectFilterOperators(),
        },
        {
            field: 'account',
            headerName: 'Konto',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            valueOptions: (accounts ?? []).map(account => ({label: account.name, value: account.id})),
            aggregable: false,
            editable: true,
            filterOperators: getGridSingleSelectFilterOperators(),
        },
        {
            field: 'transaction_count',
            headerName: 'Transaktionen',
            flex: 1,
            minWidth: 100,
            type: 'number',
            valueGetter: (_value, row) => row.transactions?.length ?? 0,
            aggregable: true,
            filterOperators: getGridNumericFilterOperators(),
        },
    ]
}