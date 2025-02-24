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

            <Divider/>

            <NavigationListItem
                label={'Verträge'}
                icon={<HistoryEdu/>}
                to={"contracts/"}
            />
            <Divider/>

            <NavigationListContainer icon={<LibraryBooksIcon/>} label={"Buchungen"}>
                <NavigationListItem
                    label={'Ausgaben'}
                    to={"records/"}
                />
                <NavigationListItem
                    label={'Statistik'}
                    to={"insights/"}
                />
            </NavigationListContainer>

            <Divider/>

            <NavigationListContainer icon={<AccountBalance/>} label={"Bank"}>
                <NavigationListItem
                    label={'Transaktionen'}
                    to={"transactions/"}
                />
                <NavigationListItem
                    label={'Staging Area'}
                    to={"transactions/staging/"}
                />
                <NavigationListItem
                    label={'Import'}
                    to={"transactions/import/"}
                />
            </NavigationListContainer>

            <Divider/>

            <LogoutListItem/>
        </List>
    )
}

