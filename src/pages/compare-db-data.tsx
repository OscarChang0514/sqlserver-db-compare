'use client';
import { TableInfoCards } from '@/components/card/cards/TableInfoCards';
import { ConnectionPoolCard } from '@/components/card/ConnectionPoolCard';
import { CompareOptions } from '@/components/pages/compare-db/CompareOptions';
import { DatabaseComparedTable } from '@/components/table/databaseComoparedTable/DatabaseComoparedTable';
import { DatabaseDiffInfo, DatabaseObjInfo, TableInfo } from '@/model/db-info';
import { compareDbDiff } from '@/util/compare-db';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Container, Divider, Fab, Fade, Grid, Stack, Tooltip, Typography } from '@mui/material';
import Head from 'next/head';
import { useRef, useState } from 'react';

interface CompareDbDataPageProps {

}

const CompareDbDataPage: React.FC<CompareDbDataPageProps> = () => {

    const dbInfoRef = useRef<{ source?: DatabaseObjInfo[], target?: DatabaseObjInfo[] }>({});

    const optionsRef = useRef<{ [key: string]: boolean }>({ compareSpace: true });

    const tableInfosRef = useRef<TableInfo[]>([]);

    const isComparingRef = useRef<boolean>(false);

    const [compareRes, setCompareRes] = useState<DatabaseDiffInfo[]>([]);

    const [showResult, setShowResult] = useState<boolean>(false);

    const [tableInfoReadonly, setTableInfoReadonly] = useState<boolean>(false);

    const handleDbInfoCollected = (data: any, key: string) => {
        key === 'source' && (dbInfoRef.current.source = data.dbObj);
        key === 'target' && (dbInfoRef.current.target = data.dbObj);
        setTableInfoReadonly(true);
    };

    const handleClear = async () => {
        setShowResult(false);
        setTimeout(() => setCompareRes([]), 600);
    }

    const startCompare = async () => {
        if (!(dbInfoRef.current.source && dbInfoRef.current.target)) {
            alert('Please confirm that the data collection is complete');
        } else {
            isComparingRef.current = true;
            let { source, target } = dbInfoRef.current;
            let options = optionsRef.current;
            setCompareRes(compareDbDiff(source, target, options));
            isComparingRef.current = false;
            setShowResult(true);
        }
    };

    return (<>
        <Head>
            <title>DB Compare</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container maxWidth="lg">
            <Typography variant="h6" noWrap>
                Tables
            </Typography>
            <Divider />
            <Box sx={{ padding: '20px 0' }}>
                <TableInfoCards
                    readonly={tableInfoReadonly}
                    onTableInfosChange={data => tableInfosRef.current = data}
                />
            </Box>
            <Typography variant="h6" noWrap>
                Conntion pools
            </Typography>
            <Divider />
            <Grid container spacing={2} sx={{ padding: '20px 0' }} columns={{ xs: 6, sm: 12, md: 12 }} >
                <Grid item xs={6}>
                    <ConnectionPoolCard dataComporeMode
                        tableInfosRef={tableInfosRef}
                        title={'Source DB'}
                        label={'source'}
                        onDbInfoCollected={data => handleDbInfoCollected(data, 'source')}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ConnectionPoolCard dataComporeMode
                        tableInfosRef={tableInfosRef}
                        title={'Target DB'}
                        label={'target'}
                        onDbInfoCollected={data => handleDbInfoCollected(data, 'target')}
                    />
                </Grid>
            </Grid>
            <Typography variant="h6" noWrap>
                Options
            </Typography>
            <Divider />
            <Stack direction="row" spacing={2} sx={{ padding: '20px 0' }}>
                <CompareOptions default={optionsRef.current} onOptionChange={data => (optionsRef.current = data)} />
                <Divider orientation="vertical" flexItem />
                <Tooltip title="Clear">
                    <Fab size="medium" color="primary" aria-label="clean" onClick={handleClear}>
                        <CleaningServicesIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="Start Compare">
                    <Fab size="medium" color="success" aria-label="compare" onClick={startCompare}>
                        <PlayArrowIcon />
                    </Fab>
                </Tooltip>
            </Stack>
            <Fade in={showResult} unmountOnExit >
                <Box>
                    <Typography variant="h6" noWrap>
                        Compare result
                    </Typography>
                    <Divider />
                    <Box sx={{ padding: '20px 0' }}>
                        <DatabaseComparedTable rows={compareRes} options={{ context: 0, matching: 'lines' }} />
                    </Box>
                </Box>
            </Fade>
        </Container>
    </>)
}

export default CompareDbDataPage;