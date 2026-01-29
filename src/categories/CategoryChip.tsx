import React, {CSSProperties} from "react";
import {Chip} from "@mui/material";
import {CategoryCircle} from "./CategoryCircle";
import {useGetCategoriesQuery} from "../app/api";

interface CategoryChipProps {
    name: string
    color: string
}

export const CategoryChip = ({name, color}: CategoryChipProps) => {
    const divStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        marginLeft: "calc(-12px + 0.25rem)",
        marginRight: "-2px",
    }

    return <Chip label={<div style={divStyle}><CategoryCircle color={color}/> {name}</div>}/>
}

interface CategoryChipContainerProps {
    id: number
}

export const CategoryChipContainer = ({id}: CategoryChipContainerProps) => {
    const {data} = useGetCategoriesQuery()
    const category = (data ?? []).find(category => category.id === id)
    return <CategoryChip name={category?.name ?? ""} color={category?.color ?? ""}/>
}