import DemandPage from '/lib/models/pages/DemandPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'OpenDemandTracker'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new DemandPage(config);
    page.build();
});