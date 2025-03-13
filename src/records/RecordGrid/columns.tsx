import {GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {Account, Category, Contract} from "../../app/types";
import {AmountDisplay} from "../../core/AmountDisplay";
import {Link} from "react-router-dom";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import dayjs from "dayjs";
import {CategoryDisplay} from "../../categories/CategoryDisplay";
import React from "react";
import {RowModel} from "./RecordGrid";


export const createGridColDef = (categories: Category[] | undefined, contracts: Contract[] | undefined, accounts: Account[] | undefined): GridColDef<RowModel>[] => {
    return [
        {
            field: 'id',
            headerName: 'ID',
            type: 'string',
            aggregable: false,
            filterable: true,
        },
        {
            field: 'amount',
            headerName: 'Betrag',
            renderCell: ({value}) => <AmountDisplay value={value}/>,
            type: 'number',
            minWidth: 100,
            filterable: true,
        },
        {
            field: 'subject',
            headerName: 'Betreff',
            flex: 1,
            minWidth: 100,
            type: 'string',
            aggregable: false,
            renderCell: ({value, id, row}) => (
                <span>
                    <Link to={`/records/${id}/update/`}>{value}</Link>
                    {row.counter_booking && (
                        <span>
                            {' '}
                            (<InsertLinkIcon/> {row.counter_booking})
                        </span>
                    )}
                </span>
            ),
            filterable: true,
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
            filterable: true,
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
            filterable: false,
        },
        {
            field: 'category',
            headerName: 'Kategorie',
            flex: 1,
            minWidth: 100,
            type: 'singleSelect',
            display: 'flex',
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
        },
        {
            field: 'transaction_count',
            headerName: 'Transaktionen',
            flex: 1,
            minWidth: 100,
            type: 'number',
            valueGetter: (_, row) => row.transactions.length,
            aggregable: true,
            filterable: false,
        },
    ]
}