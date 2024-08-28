
export default class DrilldownTable {
    constructor(json, structure = {}) {
        this.json = json;
        this.structure = structure;
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

    getHTML() {
        let div = document.createElement('div');
        div.classList.add('table-responsive');
        let table = document.createElement('table');
        table.classList.add('table', 'table-sm');
        table.id = 'drilldown_table';
            
        table.appendChild(this.generateTableHead());
        table.appendChild(this.generateTableBody());

        div.appendChild(table);
        return div.outerHTML;
    }

    generateTableHead() {
        const headers = Object.keys(this.json[0]);
        let headerRow = document.createElement('tr');
        headers.forEach(columnName => {
            if (columnName !== 'RowClass') {
                let placeholder = this.getPlaceholder(columnName);
                let th = document.createElement('th');
                let headerText = (placeholder == '') ? columnName : placeholder;
                let textNode = document.createTextNode(headerText);
                th.className = 'th';
                th.width = this.getColumnWidth(columnName);
                th.appendChild(textNode);
                headerRow.appendChild(th);
            }
        });

        return headerRow;
    }

 
    generateTableBody() {
        const tbody = document.createElement('tbody');
        let clientHeight = window.innerHeight;
        let maxRows = 39 - (clientHeight < 800 ? 5 : 0);
        let cntRows = 0;

        this.json.forEach(jsonrow => {
            cntRows++;
            if (cntRows < maxRows) {
                let row = document.createElement('tr');

                Object.keys(jsonrow).forEach(key => {

                    if (key === 'RowClass') {
                        if (jsonrow[key] !== '') {
                            row.classList.add(jsonrow[key]);
                        }
                    } else {
                        let cell = document.createElement('td');
                        let dataValue = jsonrow[key];

                        let tdFormatting = this.getCellFormatting(key, dataValue);
                        let tdClass = tdFormatting.tdClass;
                        if (tdClass != '') {
                            cell.classList.add(tdClass);
                        };
                        cell.innerHTML = tdFormatting.cellValue;
                        //let textNode = document.createTextNode(tdFormatting.cellValue);
                        //cell.appendChild(textNode);
                        row.appendChild(cell);
                    }
                })

                tbody.appendChild(row);
            }
        });

        return tbody;
    }

    getColumnWidth(columnName) {
        return (this.structure.hasOwnProperty(columnName))
            ? this.structure[columnName].width
            : '';
    }

    getPlaceholder(columnName) {
        let result = (this.structure.hasOwnProperty(columnName))
            ? this.structure[columnName].placeholder
            : '';

        if (result === '[currentFY]') {
            return this.getFY();
        }

        if (result === '[priorFY]') {
            return this.getPriorFY(this.getFY());
        }

        return '';
    }

    getFY() {
        let fy = 'FY';
        let fq = '';
        let fq_suffix = '';
        try {
            fy = document.getElementsByClassName('sidebar-year-element selected')[0].innerText;
            fq = document.getElementsByClassName('sidebar-quarter-element selected')[0].innerText;
            fq_suffix = (fq == 'ALL') ? '' : `-${fq}`;
        } catch (e) {
            console.log(e);
        }
        return fy.replace('FY20', 'FY').concat(fq_suffix);
    }

    getPriorFY(thisFY) {
        const fy = parseInt(thisFY.replace('FY', ''));
        return 'FY'.concat(fy - 1);
    }

    getCellFormatting(columnName, cellValue) {
        let tdClass = "";
        let tdSpecial = "";

        if (this.structure.hasOwnProperty(columnName)) {
            tdClass = (this.structure[columnName].hasOwnProperty('cellClass')) ? this.structure[columnName].cellClass : '';

            tdSpecial = (this.structure[columnName].hasOwnProperty('special')) ? this.structure[columnName].special : '';
        };

        cellValue = this.getSpecial(cellValue, tdSpecial);

        return { tdClass, tdSpecial, cellValue };
    }

    getSpecial(cellValue, tdSpecial) {
        if (tdSpecial === 'upDownPerc') return this.getSpecialUpDownPercentage(cellValue);
        if (tdSpecial === 'perc') return this.getSpecialPercentage(cellValue);
        if (tdSpecial === ',') return this.getSpecialComma(cellValue);
        if (tdSpecial === 'RAG') return this.getSpecialRAG(cellValue);
        return cellValue;
    }

    getSpecialPercentage(cellValue) {
        return `${(cellValue * 100).toFixed(2)}%`;
    }

    getSpecialUpDownPercentage(cellValue) {
        const perc = this.getSpecialPercentage(cellValue); // `${(cellValue * 100).toFixed(2)}%`;
        
        if (cellValue > 0) return `${perc}<i class="fas fa-arrow-up green"></i>`;
        if (cellValue < 0) return `${perc}<i class="fas fa-arrow-down red"></i>`;
        return perc;
    }



    getSpecialComma(cellValue) {
        return (cellValue).toLocaleString(undefined);
    }

    getSpecialRAG(cellValue) {
        if (cellValue === 'GREEN') return '<i class="far fa-lightbulb green"></i>';
        if (cellValue === 'YELLOW') return '<i class="far fa-lightbulb amber"></i>';
        if (cellValue === 'RED') return '<i class="far fa-lightbulb red"></i>';
        return cellValue;
    }


}