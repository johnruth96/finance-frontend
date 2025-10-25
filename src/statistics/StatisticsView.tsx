import React, {useState} from 'react'
import {Page} from '../core/Page'
import dayjs from 'dayjs'
import {Alert, Box, Grid} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers'
import {IncomeExpenseView} from "./IncomeExpenseView";

export const StatisticsView = ({}) => {
    const [dateStart, setDateStart] = useState(dayjs.utc().startOf('month'))
    const [dateEnd, setDateEnd] = useState(dayjs.utc().endOf('month'))

    return (
        <Page title={'Statistics'}>
            {/* Input */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid item xs={6} sm>
                    <DatePicker
                        label={'Beginn'}
                        value={dateStart}
                        onChange={(value) => {
                            if (value !== null) {
                                setDateStart(value)
                            }
                        }}
                        sx={{width: "100%"}}
                    />
                </Grid>
                <Grid item xs={6} sm>
                    <DatePicker
                        label={'Ende'}
                        value={dateEnd}
                        onChange={(value) => {
                            if (value !== null) {
                                setDateEnd(value)
                            }
                        }}
                        sx={{width: "100%"}}
                    />
                </Grid>
            </Grid>

            <Box sx={{mb: 8}}>
                <IncomeExpenseView dateStart={dateStart} dateEnd={dateEnd}/>
            </Box>

            <Alert severity={"info"}>
                TODO: Add table with expenses and drill-down feature
            </Alert>
        </Page>
    )
}
