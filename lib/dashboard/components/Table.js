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
                    if(row === 0) {
                        let th = headerRow.insertCell(-1); 
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
            
                    td.innerHTML = cellValue.innerText;

                    if (cellValue.classList != "") {
                        let classes = cellValue.classList.split(',');
                        classes.forEach(c => {
                            td.classList.add(c);
                        });
                        //td.classList.add(cellValue.classList);
                    }
            
                    //Drilldown handlers
                    if(columnName === 'ID') {
                        if(cellValue.innerText != '0') {
                            bodyRow.title = 'Select this account...';
                            bodyRow.classList.add('drilldown');
                            bodyRow.addEventListener('click', () => {
                                console.log(this);
                                this.drilldownToAccount(cellValue.innerText);
                                
                            });
                        } else {
                            td.innerText = 'N/A';
                        }
                    }  
                } 

            }
        }
        component.appendChild(table);
    }

    getTableCellFormatting(columnName, value, divideBy) {

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



    // -------------- Getters for the column formatting -------------------
    // -- consider replacing with a JSON configuration file and refactor --
    get TD_DECIMAL() {
        return ['Actual', 'Forecast', 'Fcst', 'NIF', 'Won', 'Rev', 'Exp', 'Cost', 'TCV', 'ABR', 'IYR', 'IQR', 'Deal', 'Security', 'Q1', 'Q2', 'Q3', 'Q4', 'FY', 'PriorFY', 'ThisFY', 'Budget', 'vsBudget',
            'AOP', 'Sec', 'SF', 'HZ', 'Gap', 'Risk', 'Prior', 'Current', 'S&B', 'Total', 'Perc', 'Backlog'];
    }

    get TD_INTEGER() {
        return ['Green', 'Yellow', 'Red', '#'];
    }

    get TD_MIDWIDTH() {
        return ['OppID', 'Category', 'Stage', 'AOP%'];
    }

    get TD_NARROW() {
        return [...this.TD_RAG, 'Actual', 'Forecast', 'Fcst', 'NIF', 'ID', 'Red', 'Yellow', 'Green', 'Won', 'Rev', 'Exp', 'Cost', 'TCV', 'ABR', 'IYR', 'IQR', 'Decision', 'Request', 'Deal', '#',
            'Security', 'Sec%', 'Q1', 'Q2', 'Q3', 'Q4', 'FY', 'PriorFY', 'ThisFY', 'Budget', 'YoY', 'vsBgt', 'AOP', 'AOP%', 'Sec', 'SF', 'HZ', 'Gap', 'Risk', 'Prior', 'Current',
            'S&B', 'Total', 'Perc'];
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