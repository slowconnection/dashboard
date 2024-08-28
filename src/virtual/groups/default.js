import VirtualTeamsPage from '/lib/models/pages/virtualTeamsPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'VirtualGroups'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new VirtualTeamsPage(config);
    page.build();
});