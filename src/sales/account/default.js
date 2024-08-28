import AccountTrackerPage from '/lib/models/pages/AccountTrackerPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'AccountTracker'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new AccountTrackerPage(config);
    page.build();
});