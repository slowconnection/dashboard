import DrilldownCreator from '../DrilldownCreator.js?v=1.0';

export default class ComponentBase {
    constructor(config) {
        this.config = config;
        this.dashboard = config.dashboard;
        this.filters = config.filters;
        this.repo = config.repo;

        const id = this.config.id;
        this.elementId = `component-${id}`;
        this.headerElement = document.getElementById(`component-header-${id}`);
        this.bodyElement = document.getElementById(`component-body-${id}`);
        this.footerElement = document.getElementById(`component-footer-${id}`);
        this.url = '/api/GetDashboardData.asp';
        this.json = {};
    }

    // Abstract method to be implemented by classes that inherit from this (ComponentChart, ComponentTable, etc).
    async build() {}

    async create() {
        this.bodyElement.innerHTML = "<div class='no-data'>Loading...</div>";
        this.json = await this.repo.getDataAsync(this.url, this.filters);
        this.headerElement.innerHTML = this.headerElement.innerHTML.replace('FY', this.getFY());
        this.addInfoDrilldown();
        this.bodyElement.innerHTML = "";
        await this.build();
        
    }

    addInfoDrilldown() {
        this.infoDrilldown = new DrilldownCreator(this.config, this.filters, 'info');
        this.infoDrilldown.create();
    }

    getMaxValue(datasets) {
        let maxValue = 0;
        for (let i = 0; i < datasets.length; i++) {
            let datasetMaxValue = Math.max(maxValue, datasets[i].data.reduce((element, max) => Math.abs(element) > Math.abs(max) ? Math.abs(element) : Math.abs(max), 0));
            maxValue = (datasetMaxValue > maxValue) ? datasetMaxValue : maxValue;
        }
        return maxValue;
    }

    fixHeaderText(from, to, currentHeader) {
        var measure = (currentHeader.includes('$')) ? '$' : '#';
        const fromText = this.numberToShorten(from, measure);
        const toText = this.numberToShorten(to, measure);

        return currentHeader.replace(fromText, toText);
    }

    numberToShorten(n, measure) {
        if (n === 1000000) return `${measure}m`;
        if (n === 1000) return `${measure}k`;
        return `${measure}`;
    }

    calculateDivideBy(standardDivideBy, maxValue) {
        if(maxValue < 4999 && standardDivideBy > 1) {
            return 1;
        } else if(maxValue < 999999  && standardDivideBy > 1) {
            return 1000;
        }
        return standardDivideBy;
    }

    showNoDataMessage() {
        this.bodyElement.innerHTML = '<div class="no-data">NO DATA</div>';
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
        const fy = parseInt(thisFY.replace('FY',''));
        return 'FY'.concat(fy - 1);
    }

    titleCase(str) {
      return str.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    }

    drilldownToAccount(ID) {
        const filter = document.getElementById('filter_account');
        filter.value = ID;
        document.forms[0].submit();
    }
}