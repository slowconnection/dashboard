import LeadsPage from '/lib/models/pages/LeadsPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Leads'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new LeadsPage(config);
    page.build();
});