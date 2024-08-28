import Table from './Table.js?v=1.0';
import DrilldownCreator from '../DrilldownCreator.js?v=1.0';

export default class TableWithDrilldown extends Table {
    constructor(config, filters) {
        super(config, filters);
    }

    //override    
    createTable() {
        const component = this.bodyElement;
        const json = this.json;
        const divideBy = this.divideBy;

        const rows = json.length;
        const thisFY = this.getFY();
        const priorFY = this.getPriorFY(thisFY);
    
        const table = document.createElement('table');
        table.classList.add('component-table');
        const headerRow = table.insertRow(-1); 

        //Iterate SQL rows
        for(let row=0; row<rows; row++) {
            let rowKeys = Object.keys(json[row]);
            let rowValues = Object.values(json[row]);
            let bodyRow = table.insertRow(-1); 

            //Iterate SQL columns
            for(let col=0; col<rowKeys.length; col++) {
                let columnName = rowKeys[col];            
                if(columnName == 'RowClass' ) {
                    if(rowValues[col] != '') {
                        bodyRow.classList.add(rowValues[col]);
                    }

                } else {

                    //Header
                    if (row === 0) {
                        let th = headerRow.insertCell(-1);
                        th.id = `${this.config.ComponentId}_H_${col}`;
                        th.innerText = (columnName === 'ThisFY') ? thisFY : (columnName === 'PriorFY') ? priorFY : columnName;
                        th.width = this.getColumnWidth(columnName);     
                        th.className = 'th';
                    }

                    //Body
                    let td = bodyRow.insertCell(-1); 
                    let cellValue;
                    let dataValue = rowValues[col];
                    if(/%$/.test(rowValues[0]) && col > 0) {
                        cellValue = this.getTableCellFormatting('PERC', dataValue.toString().concat('%'), divideBy);
                    } else {
                        cellValue = this.getTableCellFormatting(columnName, dataValue, divideBy);
                    }

                    if (col === 0) {
                        td.id = `${this.config.ComponentId}_${row}_H`;
                        if (columnName === 'ID') {
                            td.title = 'Select this account...';
                            td.classList.add('cellDrilldown');
                            td.addEventListener('click', (e) => {
                                this.drilldownToAccount(dataValue);
                            });
                        }

                    } else {
                        td.id = `${this.config.ComponentId}_${row}_${col}`;
                        td.classList.add('cellDrilldown');

                        if (columnName === 'Account') {
                            td.title = 'Select this account...';
                            td.addEventListener('click', (e) => {
                                const rowHeaderId = this.getRowHeader(e.target.id);
                                const rowHeader = document.getElementById(`${rowHeaderId}`).innerText;
                                this.drilldownToAccount(rowHeader);
                            });
                        } else {
                            td.addEventListener('click', (e) => {
                                this.clickHandler(e.target.id);
                            });
                        }
                    }
                    
                    td.innerHTML = cellValue.innerText;

                    if (cellValue.classList != "") {
                        let classes = cellValue.classList.split(',');
                        classes.forEach(c => {
                            td.classList.add(c);
                        });
                    }
                    
                } 

            }
        }
        component.appendChild(table);
    }


    clickHandler(e) {
        const componentId = this.config.id;
        const columnHeaderId = this.getColumnHeader(e);
        const rowHeaderId = this.getRowHeader(e);
        const columnHeader = document.getElementById(`${columnHeaderId}`).innerText;
        const rowHeader = document.getElementById(`${rowHeaderId}`).innerText;

        let clickedItem = {
            'filterComponent': componentId,
            'filterColumn': columnHeader,
            'filterRow': rowHeader
        };

        let componentDrilldown = new DrilldownCreator(this.config, this.filters, this.config.drilldown, clickedItem);
        componentDrilldown.create();

        
    }

    getColumnHeader(id) {
        const elements = id.split('_');
        elements[1] = 'H';
        return elements.join('_');
    }

    getRowHeader(id) {
        const elements = id.split('_');
        elements[2] = 'H';
        return elements.join('_');
    }


}