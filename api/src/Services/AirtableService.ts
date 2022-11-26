import  airtable from 'airtable'
import { FieldSet } from 'airtable/lib/field_set';
import { QueryParams } from 'airtable/lib/query_params';


export default class AirtableService{
    _base: airtable.Base;

    constructor(apiKey: string, baseId: string) {
        this._base = new airtable({apiKey:apiKey}).base(baseId)
    }

    async getRecordById(table, recordId){
        console.log(`Getting record ${recordId}`)
        console.log(`Getting from table ${table}`)
        return await this._base(table).find(recordId)
    }

    getRecordsList(tableName, take ){
    }

    async getRecordsByFields(table: string, fields:{}){
        return await this._base(table).select().all(fields)
    }

    filterByFormulaBuilder(match:{}){
        let formula = ""
        let keys = Object.keys(match)
        let values = Object.values(match)
        if(keys.length == 0) return

        keys.forEach((key, i)=>{
            if(formula.length > 0){
                formula += ', '
            }
            formula += `{key} = "${values[i]}` 
        })
        return `AND (${formula})`
    }
}