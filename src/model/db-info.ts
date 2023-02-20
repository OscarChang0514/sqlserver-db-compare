export interface DatabaseObjInfo {
    objName: string;
    definition: string;
}

export interface DatabaseSchemaInfo {
    tableName: string;
    columnName: string;
    columnInfo: string;
}

export interface DatabaseInfo {
    dbObj: DatabaseObjInfo[];
    dbSchema: DatabaseSchemaInfo[];
}

export interface DatabaseDiffInfo {
    objName: string;
    type: string;
    message: string;
    definition?: { source: string, target: string };
}