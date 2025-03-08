import React from 'react'
import {Divider, List} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import {NavigationListItem} from './NavigationListItem'
import {AccountBalance, HistoryEdu} from "@mui/icons-material";
import {NavigationListContainer} from "./NavigationListContainer";
import {LogoutListItem} from "./LogoutListItem";


export const NavigationList = () => {
    return (
        <List>
            <NavigationListItem
                label={'Dashboard'}
                icon={<HomeIcon/>}
                to={""}
            />

            <Divider sx={{my: 2}}/>

            <NavigationListItem
                label={'Verträge'}
                icon={<HistoryEdu/>}
                to={"contracts/"}
            />

            <Divider sx={{my: 2}}/>

            <NavigationListContainer icon={<LibraryBooksIcon/>} label={"Haushaltsbuch"}>
                <NavigationListItem
                    label={'Ausgaben'}
                    to={"records/"}
                />
                <NavigationListItem
                    label={'Statistik'}
                    to={"insights/"}
                />
            </NavigationListContainer>

            <Divider sx={{my: 2}}/>

            <NavigationListContainer icon={<AccountBalance/>} label={"Bank"}>
                <NavigationListItem
                    label={'Transaktionen'}
                    to={"transactions/"}
                />
                <NavigationListItem
                    label={'Zuletzt Erstellt'}
                    to={"transactions/latest/"}
                />
                <NavigationListItem
                    label={'Import'}
                    to={"transactions/import/"}
                />
                <NavigationListItem
                    label={'Regeln'}
                    to={"transactions/rules/"}
                    disabled
                />
            </NavigationListContainer>

            <Divider sx={{my: 2}}/>

            <LogoutListItem/>
        </List>
    )
}

