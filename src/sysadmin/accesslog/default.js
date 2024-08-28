import ReadOnlyPage from '/lib/models/pages/ReadOnlyPage.js';

const config = {
    pageType: 'ReadOnly',
    menuType: 'Standard',
    pagingType: 'Standard'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new ReadOnlyPage(config);
    page.build();
});