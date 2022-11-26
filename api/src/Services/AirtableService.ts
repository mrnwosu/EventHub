import  airtable from 'airtable'


export default class AirtableService{
    _base: airtable.Base;

    constructor(apiKey: string, baseId: string) {
        this._base = new airtable({apiKey:apiKey}).base(baseId)
    }

    async getRecordById(table, recordId){
        console.log(`Getting record ${recordId}`)
        console.log(`Getting from table ${table}`)
        return await this._base('Events').find(recordId)
    }

    getRecordsList(tableName, take ){

    }

    getRecordByMatch(table: string, match:{}){

    }
}