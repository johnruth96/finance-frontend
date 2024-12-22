import {Container} from "@mui/material";
import React from "react";

export const Page = ({children}) => {
    return (
        <Container sx={{p: 2, display: "flex", justifyContent: "center", marginTop: 8}}>{children}</Container>
    )
}