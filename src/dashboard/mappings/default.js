import DashboardAccountMappingPage from '/lib/models/pages/DashboardAccountMappingPage.js';

const config = {
    pageType: 'DashboardAccountMapping',
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'DashboardAccountMappings'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new DashboardAccountMappingPage(config);
    page.build();
});