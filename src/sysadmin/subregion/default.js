import SubRegionsPage from '/lib/models/pages/SubRegionsPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'SubRegions'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new SubRegionsPage(config);
    page.build();
});