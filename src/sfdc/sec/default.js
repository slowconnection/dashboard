import SalesforceDxcPage from '/lib/models/pages/SalesforceDxcPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'SalesforceSec'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new SalesforceDxcPage(config);
    page.build();
});