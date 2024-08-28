import ComponentBase from './ComponentBase.js?v=1.0';

export default class Table extends ComponentBase {
    constructor(config, filters) {
        super(config, filters);
    }

    async build() {
        this.maxValue = this.getMaxValue();

        if (this.maxValue === 0) {
            this.showNoDataMessage();
        } else {
            this.divideBy = this.calculateDivideBy(this.config.divideBy, this.maxValue);

            if (this.config.divideBy != this.divideBy) {
                this.headerElement.innerText = this.fixHeaderText(this.config.divideBy, this.divideBy, this.headerElement.innerText);
            }


            this.createTable();
        }
    }

    getMaxValue() {
        let maxValue = 0;
        let rows = this.json.length;
        for(let row=0; row<rows; row++) {
            let rowValues = Object.values(this.json[row]);
            for(let col=0; col<rowValues.length; col++) {
                if(typeof rowValues[col] === 'number') {
                    let cellValue = Math.abs(rowValues[col]);
                    if(cellValue > maxValue) maxValue = cellValue;
                }
            }
        }
        return maxValue;
    }

    createTable() {
        const component = this.bodyElement;
        const TABLE = this.generateTable(JSON);
        component.appendChild(TABLE);
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
                let headerText = (columnName === 'ThisFY') ? thisFY : (columnName === 'PriorFY') ? priorFY : columnName;
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
        const divideBy = this.divideBy;

        this.json.forEach(jsonrow => {
            let row = document.createElement('tr');

            Object.keys(jsonrow).forEach(key => {
                let cellValue;
                if (key === 'RowClass') {
                    if (jsonrow[key] !== '') {
                        row.classList.add(jsonrow[key]);
                    }
                } else {
                    let cell = document.createElement('td');
                    let dataValue = jsonrow[key];
                    if (/%$/.test(dataValue) && col > 0) {
                        cellValue = this.getTableCellFormatting('PERC', dataValue.toString().concat('%'), divideBy);
                    } else {
                        cellValue = this.getTableCellFormatting(jsonrow[key], dataValue, divideBy);
                    }

                    cell.innerHTML = cellValue.innerText;
                    if (cellValue.classList != "") {
                        let classes = cellValue.classList.split(',');
                        classes.forEach(c => {
                            cell.classList.add(c);
                        });
                    }
                    row.appendChild(cell);
                }
            })

            tbody.appendChild(row);
        });

        return tbody;
    }
   

    getTableCellFormatting(columnName, value, divideBy) {
        //if (value.endsWith('%')) {
        //if(value.substr(-1) == '%')
        //    if (parseFloat(value) > 999) {
        //        value = '>999%';
        //    }
        //    if (parseFloat(value) < -999) {
        //        value = '<999%';
        //    }
        //}

        if (this.TD_DECIMAL.includes(columnName)) {
            let redText = '';
            if (this.TD_REDNEGATIVES.includes(columnName) && value < 0) {
                redText = ',red';
            }

            return {
                'innerText': (typeof value === 'number') ? (value / divideBy).toFixed(2) : value, 
                'classList': 'cb' + redText
            };
        }

        if (this.TD_PERC.includes(columnName)) {
            let innerText = (value == '0.0%') ? '-' : value;
            
            return {
                'innerText': innerText, 
                'classList': 'cb'
            };
        }

        if(this.TD_INTEGER.includes(columnName)) {
            let innerText = (value == 0) ? '' : value;
            return {
                'innerText': innerText, 
                'classList': "cb"
            };
        }

        if(this.TD_PROPERCASE.includes(columnName)) {
            return {
                'innerText': this.titleCase(value), 
                'classList': ""
            };
        }

        if(this.TD_RAG.includes(columnName)) {
            let status = (value === 'GREEN') ? 'full' : (value === 'YELLOW') ? 'half' : 'empty';

            return {
                'innerText': `<i class="fas fa-battery-${status}"></i>`,
                'classList': `rag-${value.toLowerCase()}`
            };
        }

        return {
            'innerText': value, 
            'classList': ''
        };
    }

    getColumnWidth(columnName) {
        return this.TD_NARROW.includes(columnName) 
            ? ['Q1','Q2','Q3','Q4','FY'].includes(columnName)
                ? '35px'
                : '40px' 
            : this.TD_MIDWIDTH.includes(columnName) 
                ? '95px' 
                : '';
    }

    drilldownToAccount(ID) {
        const filter = document.getElementById('filter_account');
        filter.value = ID;
        document.forms[0].submit();
    }

    // -------------- Getters for the column formatting -------------------
    // -- consider replacing with a JSON configuration file and refactor --
    get TD_DECIMAL() {
        return ['Actual', 'Forecast', 'Fcst', 'Won', 'Rev', 'Exp', 'Cost', 'TCV', 'ABR', 'IYR', 'Deal', 'Security', 'Q1', 'Q2', 'Q3', 'Q4', 'FY', 'PriorFY', 'ThisFY', 'Budget', 'vsBudget', 'AOP', 'Sec', 'SF', 'HZ', 'Gap', 'Risk'];
    }

    get TD_INTEGER() {
        return ['Green', 'Yellow', 'Red'];
    }

    get TD_MIDWIDTH() {
        return ['OppID', 'Category', 'Stage', 'AOP%'];
    }

    get TD_NARROW() {
        return [...this.TD_RAG, 'Actual', 'Forecast', 'Fcst', 'ID', 'Red', 'Yellow', 'Green', 'Won', 'Rev', 'Exp', 'Cost', 'TCV', 'ABR', 'IYR', 'Decision', 'Request', 'Deal',
            'Security', 'Sec%', 'Q1', 'Q2', 'Q3', 'Q4', 'FY', 'PriorFY', 'ThisFY', 'Budget', 'YoY', 'vsBgt', 'AOP', 'AOP%', 'Sec', 'SF', 'HZ', 'Gap', 'Risk'];
    }

    get TD_PERC() {
        return ['Sec%', 'PERC', 'YoY', 'AOP%'];
    }

    get TD_PROPERCASE() {
        return ['Account', 'Opportunity'];
    }

    get TD_RAG() {
        return ['projectHealth', 'overallHealth', 'financialHealth', 'clientHealth', 'solutionHealth', 'resourcesHealth', 'issuesHealth', 'riskHealth'];
    }

    get TD_REDNEGATIVES() {
        return ['Rev', 'AOP', 'Gap'];
    }

}