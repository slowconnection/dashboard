import TimesheetPage from '/lib/models/pages/TimesheetPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Standard',
    hasDrilldown: false
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new TimesheetPage(config);
    page.build();
});