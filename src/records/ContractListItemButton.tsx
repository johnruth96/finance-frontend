import {useNavigate} from "react-router-dom";
import {useGetContractsQuery} from "../app/api";
import {ListItemButton, ListItemText} from "@mui/material";
import React from "react";

interface ContractListItemButtonProps {
    id: number
}

export const ContractListItemButton = ({id}: ContractListItemButtonProps) => {
    const navigate = useNavigate()
    const {contract} = useGetContractsQuery(undefined, {
        selectFromResult: ({data}) => ({
            contract: data?.find((obj) => obj.id === id),
        }),
    })

    const handleClick = () => {
        navigate(`/contracts/${id}/`)
    }

    return (
        <ListItemButton onClick={handleClick}>
            <ListItemText primary={contract?.name}/>
        </ListItemButton>
    )
}