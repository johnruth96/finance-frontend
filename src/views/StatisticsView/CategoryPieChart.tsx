import {Skeleton} from "@mui/material";
import {PieChart, useDrawingArea} from "@mui/x-charts";
import {sum} from "lodash";
import React, {PropsWithChildren, useState} from "react";
import {adaRound} from "../../aggregate";

const PieCenterLabel = ({children}: PropsWithChildren) => {
    const {width, height, left, top} = useDrawingArea();
    return (
        <text x={left + width / 2}
              y={top + height / 2}
              textAnchor={"middle"}
              dominantBaseline={"central"}
              fontSize={20}
        >
            {children}
        </text>
    );
}

export const CategoryPieChart = ({dataset, isLoading}: {
    dataset: Array<{
        value: number
        label: string
        color?: string
    }>
    isLoading?: boolean
}) => {
    const [label, setLabel] = useState('')

    if (isLoading) {
        return <Skeleton
            variant={"circular"}
            height={400}
            width={400}
            sx={{mx: "auto"}}
        />
    } else {
        const total = adaRound(sum(dataset.map(item => item.value)))

        return <PieChart
            series={[
                {
                    data: dataset,
                    paddingAngle: 2,
                    innerRadius: 60,
                    cornerRadius: 2,
                    valueFormatter: (item) => `${item.value.toLocaleString()} €`
                },
            ]}
            height={400}
            margin={{
                left: 20,
                right: 20,
            }}
            slotProps={{legend: {hidden: true}}}
        >
            <PieCenterLabel>{Math.abs(total).toLocaleString()}&nbsp;€</PieCenterLabel>
        </PieChart>
    }
}
