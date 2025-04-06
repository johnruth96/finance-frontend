import React from 'react'
import {useDeleteRecordMutation} from "../app/api";
import {ProgressButton} from "../core/ProgressButton";
import {RecordType} from "../app/types";
import {useNavigate} from "react-router-dom";

interface DeleteRecordButtonProps {
    record: Pick<RecordType, 'id' | 'subject'>
}

export const DeleteRecordButton = ({record}: DeleteRecordButtonProps) => {
    const [deleteRecord, {isSuccess, isError, isLoading}] = useDeleteRecordMutation()
    const navigate = useNavigate()

    const handleClick = () => {
        if (confirm(`Buchung ${record.subject} löschen?`)) {
            deleteRecord(record.id).unwrap().then(() => {
                navigate(-1)
            })
        }
    }

    return (
        <ProgressButton
            onClick={handleClick}
            success={isSuccess}
            loading={isLoading}
            error={isError}
            color={"error"}
        >
            Löschen
        </ProgressButton>
    )
}