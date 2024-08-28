import RatesPage from '/lib/models/pages/RatesPage.js';

const config = {
    pageType: 'Rates',
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Rates'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new RatesPage(config);
    page.build();
});