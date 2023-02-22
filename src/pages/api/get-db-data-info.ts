// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sql, { ConnectionPool } from 'mssql';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
    [key: string]: any
}

const getDbDataInfo = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body ?? '{}')

    const sqlConfig = {
        server: body.host,
        database: body.databaseName,
        user: body.userName,
        password: body.pwd,
        options: {
            trustedConnection: true,
            encrypt: true,
            enableArithAbort: true,
            trustServerCertificate: true,
        }
    }

    let connect: ConnectionPool = null;

    let tableInfos = body.tableInfos ?? [];

    let dbObj = [];
    try {

        connect = await sql.connect(sqlConfig);

        for (let i = 0; i < tableInfos.length; i++) {
            let tableInfo = body.tableInfos[i];
            if (tableInfo.tableName && tableInfo.columns) {
                let keys: string[] = tableInfo.columns?.split(',') ?? [];
                const dataResult = await sql.query(`
                    SELECT TOP 5000 ${tableInfo.columns}
                    FROM ${tableInfo.tableName}
                    ORDER BY ${tableInfo.columns}
                    ${tableInfo.whereSql ? "WHERE " + tableInfo.whereSql : ""}
                `);
                let definition = '';

                dataResult.recordset.forEach(item => {
                    definition += keys.map(key => item[key]?.toString() ?? '').join(',') + `\n`
                })

                dbObj.push({ objName: tableInfo.tableName, definition, type: "Table" })
            }
        }

        res.status(200).json({ dbObj });

    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }

    if (connect?.connected) {
        await connect.close();
    }

};

export default getDbDataInfo;
