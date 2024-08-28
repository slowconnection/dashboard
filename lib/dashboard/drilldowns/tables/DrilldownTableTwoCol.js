export default class DrilldownTableTwoCol {
    constructor(json) {
        this.json = json;
    }

    getHTML() {
        let div = document.createElement('div');
        div.classList.add('table-responsive');
        let table = document.createElement('table');
        table.classList.add('table');
            
        table.appendChild(this.generateTableBody());

        div.appendChild(table);
        return div.outerHTML;
    }

    generateTableBody() {
        const tbody = document.createElement('tbody');
        this.json.forEach(jsonrow => {
            const headers = Object.keys(this.json[0]);

            headers.forEach(columnName => {
                let tr = document.createElement('tr');

                let th = document.createElement('th');
                th.classList.add('r');
                th.innerHTML = columnName;

                let td = document.createElement('td');
                td.innerHTML = jsonrow[columnName];

                tr.appendChild(th);
                tr.appendChild(td);

                tbody.appendChild(tr);

            });
            
        });

        return tbody;
    }


}