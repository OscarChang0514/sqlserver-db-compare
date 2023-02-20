import { DatabaseDiffInfo } from "@/model/db-info";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/system";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const CodeDiff = dynamic(() => import("react-code-diff-lite"), { ssr: false });

const ColumnRow = styled(TableRow)({
    '& > *': { borderBottom: 'unset' }
});

const CodeDiffContainer = styled(Box)({
    '.d2h-diff-table tr': { position: 'relative' },
    '.d2h-files-diff': { overflowY: 'overlay', maxHeight: '500px' },
    '.d2h-file-diff': { overflowY: 'overlay', maxHeight: '500px' }
});

interface CollapseComparedTableRowProps {
    row: DatabaseDiffInfo;
}

export const CollapseComparedTableRow: React.FC<CollapseComparedTableRowProps> = (props) => {

    const { row } = props;

    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <ColumnRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="body1" noWrap>
                        {row.objName}
                    </Typography>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell colSpan={2}>{row.message}</TableCell>
            </ColumnRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout={600} unmountOnExit>
                        <CodeDiffContainer sx={{ margin: 1 }}>
                            <CodeDiff
                                oldStr={row.definition?.source ?? ''}
                                newStr={row.definition?.target ?? ''} context={5}
                                outputFormat={row.definition?.source && row.definition?.target ? "side-by-side" : "line-by-line"}
                            />
                        </CodeDiffContainer>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}