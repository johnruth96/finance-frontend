import {GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
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
import {CategorySelectMultiple} from "../../categories/CategorySelectMultiple";
import {CategoryChipContainer} from "../../categories/CategoryChip";

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
            field: 'tags',
            headerName: 'Tags',
            flex: 2,
            minWidth: 100,
            type: 'custom',
            display: 'flex',
            editable: true,
            renderCell: ({value}: GridCellParams<RowModel>) => {
                if (Array.isArray(value)) {
                    return <div style={{display: "flex", gap:"0.5rem",  width: "100%", overflowX: "scroll"}}>
                        {value.map((tagId: number) => <CategoryChipContainer id={tagId}/>)}
                    </div>
                } else {
                    return null
                }
            },
            renderEditCell: ({id, field, value, api}) => {
                const handleValueChange = (value: string[]) => {
                    console.log(value)
                    api.setEditCellValue({id, field, value});
                }

                return <CategorySelectMultiple
                    value={value}
                    onChange={handleValueChange}
                    sx={{width: "100%"}}
                />
            },
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
            valueOptions: (contracts ?? []).map(con => ({label: con.name, value: con.id})),
            renderCell: ({value}: GridCellParams<RowModel>) => {
                const contract = (contracts ?? []).find(
                    (contract) => contract.id === value,
                )

                return contract?.name ?? ""
            },
            renderEditCell: ({id, field, value, api}) => {
                const handleValueChange = (value: string) => {
                    api.setEditCellValue({id, field, value});
                }

                return <ContractSelect
                    value={value}
                    onChange={handleValueChange} sx={{width: "100%"}}
                    variant={"standard"}
                />
            },
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