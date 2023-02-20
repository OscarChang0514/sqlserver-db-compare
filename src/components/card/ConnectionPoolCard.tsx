'use client';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Card, CardContent, Collapse, Divider, styled, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";

const StatusButton = styled(Button)({
    transitionDuration: '0.8s',
    borderRadius: '50px',
    justifyContent: 'center'
});

interface ConnectionPoolCardProps {
    title?: string;
    label?: string;
    onDbInfoCollected?: (data: any) => void;
}

export const ConnectionPoolCard: React.FC<ConnectionPoolCardProps> = (props) => {

    const [status, setStatus] = useState<number>(0);

    const [topTitle, setTopTitle] = useState<string>('-')

    const ref = useRef<HTMLFormElement>(null)

    const collectionStatus: any = [
        { variant: 'outlined', color: 'info', text: 'Collect Schema' },
        { variant: 'outlined', color: 'secondary', text: 'Collecting...' },
        { variant: 'contained', color: 'success', text: <>Collected &nbsp; <CheckIcon /></> },
        { variant: 'outlined', color: 'error', text: 'Error' },
    ];

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if ([0, 3].includes(status)) {
            setStatus(1);
            getDbInfo({
                host: e.target[1].value,
                databaseName: e.target[2].value,
                userName: e.target[3].value,
                pwd: e.target[4].value,
            })
        }
    }

    const getDbInfo = async (data: any) => {
        try {
            let response = await fetch("/api/get-db-info", { method: "POST", body: JSON.stringify(data) });
            let res = await response.json();
            if (response.ok) {
                setTopTitle(data.host + ' - ' + data.databaseName)
                setStatus(2);
                props.onDbInfoCollected(res);
            } else {
                setStatus(3);
                console.error(res);
            }
        } catch (err) {
            setStatus(3);
            console.error(err);
        }
    };

    return (
        <Card>
            <CardContent>
                <form ref={ref} onSubmit={handleSubmit}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {topTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Typography variant="h5" component="div" noWrap>
                            {props.title}
                        </Typography>
                        <Box sx={{ flex: 1 }} />
                        <StatusButton
                            type={'submit'}
                            variant={collectionStatus[status].variant}
                            color={collectionStatus[status].color}
                        >
                            {collectionStatus[status].text}
                        </StatusButton>
                    </Box>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {props.label}
                    </Typography>
                    <Collapse in={status !== 2} timeout={600}>
                        <Divider />
                        <Box sx={{ display: 'grid', gap: '10px', margin: '10px 0' }}>
                            <Box>
                                <TextField required variant="standard" label="Host" name="host" />
                            </Box>
                            <Box>
                                <TextField required variant="standard" label="Database Name" name="databaseName" />
                            </Box>
                            <Box>
                                <TextField required variant="standard" label="UserName" name="userName" />
                            </Box>
                            <Box>
                                <TextField required variant="standard" type="password" label="Pwd" name="pwd" />
                            </Box>
                        </Box>
                    </Collapse>
                </form>
            </CardContent>
        </Card>
    )
}