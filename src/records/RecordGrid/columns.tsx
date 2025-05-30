import {GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {Account, Category, Contract} from "../../app/types";
import {AmountDisplay} from "../../core/AmountDisplay";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import {CategoryDisplay} from "../../categories/CategoryDisplay";
import React from "react";
import {RowModel} from "./BaseRecordGrid";
import {
    getGridDateFilterOperators,
    getGridNumericFilterOperators,
    getGridSingleSelectFilterOperators,
    getGridStringFilterOperators
} from "../../app/url";

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
            renderCell: ({value, id, row}) => (
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
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            display: 'flex',
            editable: true,
            valueOptions: (categories ?? []).map(
                ({id, name, ...rest}: Category) => ({
                    value: id,
                    label: name,
                    ...rest,
                }),
            ),
            renderCell: ({
                             value,
                             colDef,
                             formattedValue,
                         }: GridCellParams<RowModel>) => {
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
            filterOperators: getGridSingleSelectFilterOperators(),
        },
        {
            field: 'contract',
            headerName: 'Vertrag',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            valueOptions: (contracts ?? []).map(({id, name}: Contract) => ({
                value: id,
                label: name,
            })),
            aggregable: false,
            editable: true,
            filterOperators: getGridSingleSelectFilterOperators(),
        },
        {
            field: 'account',
            headerName: 'Konto',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            valueOptions: (accounts ?? []).map(({id, name}: Account) => ({
                value: id,
                label: name,
            })),
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
            valueGetter: (_, row) => row.transactions?.length ?? 0,
            aggregable: true,
            filterOperators: getGridNumericFilterOperators(),
        },
    ]
}