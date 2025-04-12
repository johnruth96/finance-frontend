import {useUnlinkRecordFromTransactionMutation} from "../../app/api";
import {GridActionsCellItem} from "@mui/x-data-grid-premium";
import {RemoveCircle} from "@mui/icons-material";
import React from "react";

interface UnlinkActionProps {
    record: number,
    transaction: number
}

export const UnlinkAction = ({record, transaction}: UnlinkActionProps) => {
    const [unlinkRecordFromTransaction, {}] = useUnlinkRecordFromTransactionMutation()

    const handleClick = () => {
        unlinkRecordFromTransaction({record, transaction})
    }

    return (
        <GridActionsCellItem
            label="Entfernen"
            icon={<RemoveCircle/>}
            onClick={handleClick}
        />
    )
}