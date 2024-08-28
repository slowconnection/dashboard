import ForecastPage from '/lib/models/pages/ForecastPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Forecast'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new ForecastPage(config);
    page.build();
});