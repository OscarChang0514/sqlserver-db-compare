// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sql, { ConnectionPool } from 'mssql';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
    [key: string]: any
}

const getDbInfo = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
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

    try {

        connect = await sql.connect(sqlConfig);

        const dbObjResult = await sql.query`
            SELECT distinct 
                object_name(OBJECT_ID) AS objName, 
                definition
            FROM sys.sql_modules
        `;

        const tableSchemaResult = await sql.query`
            SELECT 
            c.TABLE_NAME as tableName, 
            c.COLUMN_NAME as columnName, 
            CONCAT(
                c.COLUMN_NAME,
                '  ',c.DATA_TYPE, 
                '  Default:',c.COLUMN_DEFAULT,
                '  Nullable:',c.IS_NULLABLE, 
                '  LengthInfo:',c.CHARACTER_MAXIMUM_LENGTH, 
                '  ',c.CHARACTER_OCTET_LENGTH, 
                '  ',c.NUMERIC_PRECISION, 
                '  ',c.NUMERIC_PRECISION_RADIX, 
                '  ',c.NUMERIC_SCALE
            ) AS columnInfo
            FROM Information_Schema.Columns c  
            WHERE c.TABLE_NAME NOT LIKE 'vw_%'
            ORDER BY c.TABLE_NAME, c.COLUMN_NAME
        `;

        let dbObj = dbObjResult.recordset;

        let dbSchema = tableSchemaResult.recordset;

        res.status(200).json({ dbObj, dbSchema });

    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }

    if (connect?.connected) {
        await connect.close();
    }

};

export default getDbInfo;
