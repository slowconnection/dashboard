"use strict";

import Containers from './Containers.js?v=1.0';
import ComponentCreator from './ComponentCreator.js?v=1.1';
import Repo from './Repo.js?v=1.0';
import SelectorFactory from './selectors/SelectorFactory.js';
import Sidebar from './Sidebar.js?v=1.0';
import ChartColors from './ChartColors.js?v=1.0';

export default class Dashboard {
    constructor(config) {
        this.repo = new Repo();
        this.sidebar = new Sidebar(config.dashboardTypeId, config.filterGroup | '');
        this.chartColors = new ChartColors();
        this.showAccountSelector = (config.hasOwnProperty('showAccountSelector')) ? config.showAccountSelector : false;
        this.showSubRegionSelector = (config.hasOwnProperty('showSubRegionSelector')) ? config.showSubRegionSelector : false;
        this.showCountrySelector = (config.hasOwnProperty('showCountrySelector')) ? config.showCountrySelector : false;
        this.showCapabilityLeadSelector = (config.hasOwnProperty('showCapabilityLeadSelector')) ? config.showCapabilityLeadSelector : false;
        this.showOfferingSelector = (config.hasOwnProperty('showOfferingSelector')) ? config.showOfferingSelector : false;

        this.url = '/api/GetDashboardComponents.asp';
        this.items = [];
        this.selectors = [];
        this.capabilityLeadSelector = {};
        
    }

    async create() {
        this.createSelectorObjects();
        this.buildFilters();
        this.items = await this.getDashboardJson();
        await this.buildContainers();
        await this.buildDashboard();
    }

    createSelectorObjects() {
        if (this.showAccountSelector) {
            const selector = SelectorFactory({
                selectorType: 'Account',
                parentId: 'account_selector',
                selectionId: 'filter_account',
                regionId: 'filter_region'
            });
            this.selectors.push(selector);
        }

        if (this.showOfferingSelector) {
            const selector = SelectorFactory({
                selectorType: 'Offering',
                parentId: 'offering_selector',
                selectionId: 'filter_offering',
                listName: 'SAL_offering_id',
                parent: this
            });
            this.selectors.push(selector);
        }

        if (this.showSubRegionSelector) {
            const selector = SelectorFactory({
                selectorType: 'SubRegion',
                parentId: 'subregion_selector',
                selectionId: 'filter_subregion',
                regionId: 'filter_region',
                parent: this,
                listName: 'SubRegionId',
            });
            this.selectors.push(selector);
        }

        if (this.showCountrySelector) {
            const selector = SelectorFactory({
                selectorType: 'DemandCountry',
                parentId: 'country_selector',
                selectionId: 'filter_country',
                regionId: 'filter_region'
            });
            this.selectors.push(selector);
        }

        if (this.showCapabilityLeadSelector) {
            const selector = SelectorFactory({
                selectorType: 'DemandCapabilityLead',
                parentId: 'capabilityLead_selector',
                selectionId: 'filter_capabilityLead',
                regionId: 'filter_capabilityLead'
            });
            this.selectors.push(selector);
        }
    }

    buildFilters() {
        this.sidebar.create();
        this.selectors.forEach((selector) => selector.create());
    }

    async buildContainers() {
        const containers = new Containers(this.items);
        await containers.create();
    }

    async buildDashboard() {
        this.items.forEach(async(item )=> {
            let displayItem = this.selectItemType(item);
            await displayItem.create();
        });
    }

    //Either this or create an ItemFactory that returns either Component or Kpi factory.  Too many factories!
    selectItemType(item) {
        item.dashboard = this;
        item.repo = this.repo;
        item.chartColors = this.chartColors;
        item.filters = this.getFilters(`chartType=${item.chartType}`)
                                .concat((item.measure === '')
                                    ? ''
                                    : `&measure=${item.measure}`)
                                .concat(Number.isInteger(item.FixedRegionId)
                                    ? `&FixedRegionId=${item.FixedRegionId}`
                                    : '');

        return ComponentCreator(item);
    }

    async getDashboardJson() {
        const filterDashboard = document.getElementById('filter_dashboard') ? document.getElementById('filter_dashboard').value : '';
        return await this.repo.getDashboardComponents(filterDashboard);
    }

    getFilters(filters) {
        //all filters must have an ID prefixed "filter_".  Any with value are passed through to the SQL
        const form = document.querySelector('form');
        const filtersWithValue = [...form.elements].filter((i) => i.id.startsWith('filter_') && i.value != '');
        const filtersToAdd = filtersWithValue.map((f) => `&${f.id.replace('_','')}=${encodeURIComponent(f.value)}`).join('');
        const result = filters.concat(filtersToAdd);

        return result;
    }
}