import ForecastDashboardPage from '/lib/models/pages/ForecastDashboardPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'None',
    detailScreen: 'ForecastDashboard',
    hasPaging: false,
    hasSorting: false
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new ForecastDashboardPage(config);
    page.build();
});