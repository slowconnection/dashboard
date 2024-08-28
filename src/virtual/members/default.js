import VirtualTeamMembersPage from '/lib/models/pages/virtualTeamMembersPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'VirtualTeamMembers'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new VirtualTeamMembersPage(config);
    page.build();
});