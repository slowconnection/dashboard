import Repo from '../Repo.js';
import DrilldownTable from './tables/DrilldownTable.js';
import DrilldownTableTwoCol from './tables/DrilldownTableTwoCol.js';

export default class DrilldownBase {
    constructor(config, filters) {
        this.config = config;
        this.filters = filters;
        this.repo = new Repo();
        const id = this.config.id;
        this.caption = document.querySelector('#drilldownCaption > span');
        this.modal = document.getElementById('drilldownModal');
        this.drilldownElement = document.getElementById('drilldownDetail');
        this.drilldownContent = document.getElementById('drilldownContent');
        this.footerElement = document.getElementById(`component-footer-${id}`);

        this.modalHeight = "80%";
        this.modalWidth = "80%";
        
        this.url = ''; 
        this.json = {};

    }


    async build() {
        const i = document.createElement('i');
        i.classList.add('fas','fa-info-circle','info');
        i.addEventListener('click', () => {
            this.open();
        });
        this.footerElement.appendChild(i);
    }


    async create() {
        await this.build();
    }


    async open() {
        try {
            this.json = await this.repo.getDataAsync(this.url, this.filters);
        
            this.showModal();
            this.caption.innerText = `Information about ${this.config.header}`;
            this.drilldownContent.innerHTML = `<div class='narrative'>${this.getNarrativeFromJSON(this.json)}</div>`; 
        } catch(err) {
            console.log(err);
        }
    }


    showModal() {
        const element = this.drilldownElement;
        element.style.width = this.modalWidth;
        element.style.height = this.modalHeight;

        this.modal.style.display = 'flex';
        element.style.display = 'block';
     
    }


    getNarrativeFromJSON() {
        let html = [];

        this.json.forEach((row) => {
            let content = Object.values(row)[0];
            let highlight = (Object.keys(row).length >= 2) ? `<span class='yellow'>${Object.values(row)[1]}</span>` : '';
            html.push(`<p>${content} ${highlight}</p>`);
        });

        return html.join('');
    }
   

    noDrilldown() {
        let id = this.config.id;
        const component = document.getElementById(`component-footer-${id}`);
        if (!document.getElementById(`warning-${id}`)) {
            const warning = document.createElement('span');
            warning.id = `warning-${id}`;
            warning.classList.add('warning');
            warning.innerText = 'No drilldown yet';
            component.appendChild(warning);
            setTimeout(function () { component.removeChild(warning); }, 3000);
        }
    }


    async buildTable(structure = {}) {
        await this.open();
        let drilldownTable = new DrilldownTable(this.json, structure);
        return drilldownTable.getHTML();
    }


    async buildTwoColTable() {
        await this.open();
        let drilldownTable = new DrilldownTableTwoCol(this.json);
        return drilldownTable.getHTML();
    }

}