"use strict";
import Dashboard from '/lib/dashboard/Dashboard.js?v=1.0';

document.addEventListener("DOMContentLoaded", async () =>  {
    const page = new Page({'id': 263});

    page.buildMenu();
    
    Chart.defaults.global.defaultFontFamily = 'Calibri';
    Chart.defaults.global.defaultFontSize = '10';
    Chart.defaults.global.defaultFontWeight = 'normal';

    addCloseHandlers('info');
    addCloseHandlers('drilldown');
    addCloseHandlers('zoom');

    let filterGroup = '';
    if (document.getElementById("filter_group")) {
        filterGroup = document.getElementById("filter_group").value;
    }

    const dashboard = new Dashboard({
        dashboardTypeId: 1,
        showAccountSelector: true,
        showSubRegionSelector: true,
        showOfferingSelector: true,
        filterGroup
    });
    
    await dashboard.create();

}, {once: true});

function addCloseHandlers(element = 'drilldown') {
    const btn = document.querySelector(`#${element}Caption > img`);
    const modal = document.getElementById(`${element}Modal`);
    btn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}


