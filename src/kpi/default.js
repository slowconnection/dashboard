import KpiPage from '/lib/models/pages/KpiPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'KPI'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new KpiPage(config);
    page.build();
});