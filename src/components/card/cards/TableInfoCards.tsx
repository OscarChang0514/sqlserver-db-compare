import { TableInfo } from "@/model/db-info";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Collapse, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { TableInfoCard } from "../TableInfoCard";

interface TableInfoCardsProps {
    readonly?: boolean;
    onTableInfosChange?: (tableInfos: TableInfo[]) => void;
}

export const TableInfoCards: React.FC<TableInfoCardsProps> = (props) => {

    const [tableInfos, setTableInfos] = useState<TableInfo[]>([]);

    const handleTableInfoChange = (data: TableInfo, dataIndex: number) => {
        setTableInfos(pred => {
            let result = pred.map((item, index) => index === dataIndex ? data : item);
            props.onTableInfosChange(result);
            return result
        });
    };

    const deleteTableInfo = (dataIndex: number) => {
        setTableInfos(pred => {
            let result = pred.filter((item, index) => index !== dataIndex);
            props.onTableInfosChange(result);
            return result
        });
    };

    const addTableInfo = () => {
        setTableInfos(pred => {
            let result = [...pred, { tableName: '', columns: '' }];
            props.onTableInfosChange(result);
            return result
        });
    };

    return (
        <Stack spacing={2}>
            {tableInfos.map((tableInfo, index) =>
                <TableInfoCard
                    key={index}
                    tableInfo={tableInfo}
                    readonly={props.readonly}
                    onChange={data => handleTableInfoChange(data, index)}
                    onDelete={() => deleteTableInfo(index)}
                />
            )}
            <Collapse in={!props.readonly}>
                <IconButton sx={{ borderRadius: '5px', width: '100%' }} onClick={addTableInfo}>
                    <AddCircleIcon />
                </IconButton>
            </Collapse>
        </Stack>
    )
}