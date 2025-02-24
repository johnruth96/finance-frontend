import {green, red} from "@mui/material/colors";
import React from "react";

export const AmountDisplay = ({value, sign = false}: { value: number, sign?: boolean }) => {
    const style = value === 0 ?
        {color: 'black'} :
        value > 0 ?
            {color: green[600], fontWeight: "bold"} :
            {color: red[500]}

    return <span style={style}>
        {sign && value !== 0 && <>{value > 0 ? '+' : '-'}</>}
        {Math.abs(value).toLocaleString()}&nbsp;€
    </span>
}