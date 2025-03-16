import {CategoryAggregation} from "../aggregate";
import {Box, Typography} from "@mui/material";
import {CategoryPieChart} from "./CategoryPieChart";
import React from "react";

interface CategoryChildrenPieChartView {
    categoryAgg: CategoryAggregation
}

export const CategoryChildrenPieChartView = ({categoryAgg}: CategoryChildrenPieChartView) => {
    return (
        <Box>
            <Typography variant={'h6'} align={'center'}>
                {categoryAgg.label}
            </Typography>
            <CategoryPieChart dataset={categoryAgg.children}/>
        </Box>
    )
}