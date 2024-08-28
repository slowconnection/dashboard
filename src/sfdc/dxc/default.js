import SalesforceDxcPage from '/lib/models/pages/SalesforceDxcPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'SalesforceDxc'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new SalesforceDxcPage(config);
    page.build();
});