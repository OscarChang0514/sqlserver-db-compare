import { DatabaseDiffInfo, DatabaseInfo, DatabaseObjInfo, DatabaseSchemaInfo } from "@/model/db-info";

export const compareDbDiff = (source: DatabaseInfo, target: DatabaseInfo, options: { [key: string]: boolean }) => {

    let result: DatabaseDiffInfo[] = [];
    let sourceTables = Array.from(new Set(source.dbSchema.map(item => item.tableName))).map(table => {
        return getTableInfo(table, source.dbSchema)
    });
    let targetTables = Array.from(new Set(target.dbSchema.map(item => item.tableName))).map(table => {
        return getTableInfo(table, target.dbSchema)
    });

    result = [
        // 找出target DB 沒有的物件
        ...source.dbObj.filter(item => {
            return !target.dbObj.find(tarItem => item.objName === tarItem.objName)
        }).map(item => (
            {
                objName: item.objName,
                type: getDbObjType(item.definition),
                message: 'Target 無該物件',
                definition: { source: item.definition }
            }
        )),
        // 找出source DB 沒有的物件
        ...target.dbObj.filter(item => {
            return !source.dbObj.find(sourItem => item.objName === sourItem.objName)
        }).map(item => (
            {
                objName: item.objName,
                type: getDbObjType(item.definition),
                message: 'Source 無該物件',
                definition: { target: item.definition }
            }
        )),
        // 找出都有但兩者內容不同的物件
        ...target.dbObj.reduce((sum, item) => {
            let sourDbItem = source.dbObj.find(sourItem => item.objName === sourItem.objName);
            let sourDefinition = sourDbItem ? getCleanDefinition(sourDbItem) : '';
            let tarDefinition = getCleanDefinition(item);
            if (sourDbItem && getCompareStr(sourDefinition, options) !== getCompareStr(tarDefinition, options)) {
                return [...sum, {
                    objName: item.objName,
                    type: getDbObjType(item.definition),
                    message: '內容不同',
                    definition: { target: tarDefinition, source: sourDefinition }
                }]
            }
            return sum
        }, []),

        // 找出target DB 沒有的Table Column
        ...sourceTables.filter(item => {
            return !targetTables.find(tarItem => item.tableName === tarItem.tableName)
        }).map(item => (
            {
                objName: item.tableName,
                type: 'Table',
                message: 'Target 無該物件',
                definition: { source: item.tableInfo }
            }
        )),
        // 找出source DB 沒有的Table Column
        ...targetTables.filter(item => {
            return !sourceTables.find(sourItem => item.tableName === sourItem.tableName)
        }).map(item => (
            {
                objName: item.tableName,
                type: 'Table',
                message: 'Source 無該物件',
                definition: { target: item.tableInfo }
            }
        )),
        // 找出都有但兩者內容不同的Table Column
        ...targetTables.reduce((sum, item) => {
            let sourItem: any = sourceTables.find(sourItem => item.tableName === sourItem.tableName);
            let sourCompare = getCompareStr(sourItem?.tableInfo ?? '', options);
            let tarCompare = getCompareStr(item.tableInfo, options);
            let isDiff = sourItem && sourCompare !== tarCompare;
            if (isDiff) {
                return [...sum, {
                    objName: item.tableName,
                    type: 'Table',
                    message: '內容不同',
                    definition: { source: sourItem.tableInfo, target: item.tableInfo }
                }]
            }
            return sum
        }, [])
    ]

    return result;
}

const getTableInfo = (tableName: string, schema: DatabaseSchemaInfo[]) => {

    let tableColumns = schema.filter(item => item.tableName === tableName);

    let tableInfo = '';
    tableColumns.forEach(tableColumn => {
        tableInfo += `${tableColumn.columnInfo}\n`;
    })

    return { tableName, tableInfo }
}

const getCleanDefinition = (data: DatabaseObjInfo) => {

    let sourIndex = data.definition.indexOf(" AS");
    if (sourIndex < 0) {
        sourIndex = data.definition.indexOf(" as")
    }
    if (sourIndex > 0) {
        sourIndex += 3;
    }

    return data.definition.substring(sourIndex).trim();
}

const getCompareStr = (definition: string, options: { [key: string]: any }) => {
    const { caseSensitive, compareSpace } = options;
    let str = definition ?? '';
    if (!caseSensitive) {
        str = str.toUpperCase()
    }
    if (!compareSpace) {
        str = str.replace(/\s/g, "")
    }
    return str;
}

const getDbObjType = (definition: string) => {
    let str = "  " + definition.slice(0, 300).replace(/\s/g, "").toUpperCase();
    if (str.indexOf("CREATEPROCEDURE") > 0) {
        return "Procedure"
    }
    if (str.indexOf("CREATEFUNCTION") > 0) {
        return "Function"
    }
    if (str.indexOf("CREATEVIEW") > 0) {
        return "View"
    }
    return "Obj";
}