import AccountTrackerPermissionsPage from '/lib/models/pages/AccountTrackerPermissionsPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'AccountTrackerPermissions'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new AccountTrackerPermissionsPage(config);
    page.build();
});