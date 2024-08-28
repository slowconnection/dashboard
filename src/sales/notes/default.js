import AccountNotesPage from '/lib/models/pages/AccountNotesPage.js';

const config = {
    pageType: 'AccountNotes',
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'AccountNotes'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new AccountNotesPage(config);
    page.build();
});