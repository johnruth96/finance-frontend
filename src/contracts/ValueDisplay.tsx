import React, {PropsWithChildren, ReactNode} from "react";
import {Box, Typography} from "@mui/material";
import dayjs from "dayjs";
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {green, red} from "@mui/material/colors";
import {isString} from "lodash";

interface ValueDisplayProps extends PropsWithChildren {
    label: string
    value?: ReactNode
    type?: "text" | "date" | "boolean"
    yesLabel?: string
    noLabel?: string
}

export const ValueDisplay = ({
                                 label,
                                 value,
                                 type = 'text',
                                 yesLabel = "Ja",
                                 noLabel = "Nein",
                                 children,
                             }: ValueDisplayProps) => {
    let element;
    if (children)
        element = children
    else if (type === "text")
        element = <Typography>{value}</Typography>
    else if (type === "date" && isString(value))
        element = <Typography>{dayjs(value).format("DD.MM.YYYY")}</Typography>
    else if (type === "boolean") {
        if (value)
            element = <Typography><CheckCircleIcon sx={{color: green[500]}}/> {yesLabel}</Typography>
        else
            element = <Typography><DoNotDisturbAltIcon sx={{color: red[500]}}/> {noLabel}</Typography>
    }

    return (
        <Box sx={{mb: 2}}>
            <Typography variant={"caption"} color={"text.secondary"}>{label}</Typography>
            {element}
        </Box>
    )
}