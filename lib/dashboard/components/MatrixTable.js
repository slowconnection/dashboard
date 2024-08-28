import ComponentBase from './ComponentBase.js?v=1.0';

export default class MatrixTable extends ComponentBase {
    constructor(config, filters) {
        super(config, filters);
        
        this.TD_MIDWIDTH = ['Source'];

        this.months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        this.colours = ['grey', 'red', 'green'];
        this.displayText = ['-', '<i class="fas fa-times-circle"></i>', '<i class="fas fa-check-circle"></i>'];

    }

    async build() {
        const TABLE = this.generateTable(this.json);
        this.bodyElement.appendChild(TABLE);
    }

    generateTable() {
        let table = document.createElement('table');
        table.classList.add('component-table');
            
        table.appendChild(this.generateTableHead());
        table.appendChild(this.generateTableBody());
            
        return table;
    }

    generateTableHead() {
        const headers = Object.keys(this.json[0]);
        let headerRow = document.createElement('tr');

        headers.forEach(columnName => {
            if (columnName !== 'RowClass') {
                let th = document.createElement('th');
                let headerInt = parseInt(columnName);
                let headerText = (isNaN(headerInt)) ? columnName : this.months[headerInt];
                
                let textNode = document.createTextNode(headerText);
                th.width = this.getColumnWidth(columnName);     
                th.className = 'th';
                th.appendChild(textNode);
                headerRow.appendChild(th);
            }
        });

        return headerRow;
    }

    generateTableBody() {
        const tbody = document.createElement('tbody');

        this.json.forEach(jsonrow => {
            let tr = document.createElement('tr');
        
            Object.keys(jsonrow).forEach(key => {
                let currentValue = jsonrow[key];
                let displayValue = currentValue;

                if(key === 'RowClass' ) {
                    if (currentValue !== '') {
                        tr.classList.add(currentValue);
                    }
                } else {
                    let td = document.createElement('td');
                    let headerInt = parseInt(key);
                    

                    if (!isNaN(headerInt)) {
                        displayValue = this.displayText[currentValue];
                        td.classList.add(this.colours[currentValue]);
                    } 
                    
                    td.innerHTML = displayValue;
                    tr.appendChild(td);
                }
            })
        
            tbody.appendChild(tr);
        });

        return tbody;
    }


    getCellStyle() {

    }
    

    getColumnWidth(columnName) {
        return this.TD_MIDWIDTH.includes(columnName) 
                ? '95px' 
                : '';
    }

}