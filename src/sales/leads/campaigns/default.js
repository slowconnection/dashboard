import StandardPage from '/lib/models/pages/StandardPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Campaigns'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new StandardPage(config);
    page.build();
});