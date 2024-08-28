import DrilldownCreator from '../DrilldownCreator.js?v=1.0';

export default class KpiBase {
    constructor(config) {
        this.config = config;
        this.filters = config.filters;
        this.repo = config.repo;

        const id = this.config.id;
        this.elementId = `kpi-${id}`;
        this.headerElement = document.getElementById(`kpi-header-${id}`);
        this.bodyElement = document.getElementById(`kpi-body-${id}`);
        this.footerElement = document.getElementById(`kpi-footer-${id}`);
        this.url = '/api/GetDashboardData.asp';
        this.json = {};
        
    }

    // Abstract method to be implemented by classes that inherit from this 
    async build() {
        
    }

    async create() {
        this.json = await this.repo.getDataAsync(this.url, this.filters);
        await this.build();

        if (this.config.drilldown != '') {
            let outputValue = Object.values(this.json[0]);
            if (outputValue.length > 0) {
                this.addDrilldown();
            }
        }
    }

    addDrilldown() {
        this.bodyElement.classList.add('kpiDrilldown');
        let drilldown = this.config.drilldown;
        let config = this.config;
        let filters = this.filters.concat('&filterSection=2');
        let clickedItem = {
            'filterComponent': this.bodyElement.id.split('-')[2],  //this.config.ComponentId,
            'filterDataset': 0,
            'filterIndex': 0,
            // only included for debug purposes
            'datasetName': '',
            'filterLabel': '',
            'clickedValue': 0
        };

        this.bodyElement.onclick = function () {
            let kpiDrilldown = new DrilldownCreator(config, filters, drilldown, clickedItem);
            kpiDrilldown.create();
        }
    }

}