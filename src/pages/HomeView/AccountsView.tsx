import React from "react";
import {Account, RecordType} from "../../finance/app/types";
import {Box, Grid, Paper, Stack, Typography, TypographyTypeMap} from "@mui/material";
import {BalanceView} from "../../views/StatisticsView/BalanceView";
import {useGetAccountsQuery} from "../../finance/app/api";

interface AccountViewProps {
    name: string,
    records: RecordType[]
    slotProps?: {
        name?: TypographyTypeMap
    }
}

const AccountView = ({name, records, slotProps}: AccountViewProps) => {
    const nameProps = slotProps?.name ?? {}

    return (
        <Box sx={{width: "100%"}}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography {...nameProps}>{name}</Typography>
                <BalanceView objects={records}/>
            </Stack>
        </Box>
    )
}

export const AccountsView = ({records}: { records: RecordType[] }) => {
    const {data} = useGetAccountsQuery()

    const accounts: Account[] = data ?? []

    return (
        <Grid container spacing={2} justifyContent="center" sx={{mb: 8}}>
            <Grid item xs={12} sm={6}>
                <Paper sx={{p: 2}} elevation={0} variant={"outlined"}>
                    <Stack direction={"column"} spacing={2}>
                        {accounts.map(account => {
                            const accountRecords = records.filter(record => record.account === account.id)

                            return (
                                <AccountView key={account.id} name={account.name} records={accountRecords}/>
                            )
                        })}

                        <AccountView name={"Bilanz"} records={records} slotProps={{
                            name: {
                                sx: {fontWeight: 'bold'}
                            }
                        }}/>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )

    /*return (
        <Grid container spacing={2} justifyContent="center" sx={{mb: 8}}>
            {accounts.map(account => {
                const accountRecords = records.filter(record => record.account === account.id)

                return (
                    <Grid item xs={12} sm={4} key={account.name}>
                        <StatBox label={account.name} value={<BalanceView objects={accountRecords}/>}/>
                    </Grid>
                )
            })}
            <Grid item xs={12} sm={4}>
                <StatBox label={"Gesamt"} value={<BalanceView objects={records}/>}/>
            </Grid>
        </Grid>
    )*/
}