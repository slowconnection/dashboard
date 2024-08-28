"use strict";

export default class Dashboard {
    constructor(config) {
        this.repo = config.repo;
        this.filterDashboardElem = config.filterDashboardElem || 'filter_dashboard';
        this.components = [];
    }

    async init() {
        // get list of components
        const json = await this.getData();

        Object.values(json).forEach(async (c) => {
            let component = new Component({ dashboard: this, header: c});
            this.components.push(component);
            await component.build();
        });

        console.log(this.components);

    }

    get filters() {
        return 'filterYear=1';
    }

    async getData() {
        const filterDashboard = document.getElementById(this.filterDashboardElem) ? document.getElementById(this.filterDashboardElem).value : '';
        return await this.repo.getDashboardComponents(filterDashboard);
    }
}

class Component {
    constructor(config) {
        this.config = config;
        this.dashboard = config.dashboard;
        this.repo = config.dashboard.repo;
        this.header = config.header;
        this.filters = this.dashboard.filters.concat(`&chartType=${encodeURIComponent(this.header.chartType)}`);
    }

    async build() {
        const json = await this.getData();
        console.log(json);
    }

    async getData() {
        return await this.repo.getDashboardData(this.filters);
    }

}