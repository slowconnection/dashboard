import ReadOnlyPage from '/lib/models/pages/ReadOnlyPage.js';

const config = {
    pageType: 'Basic',
    menuType: 'Standard',
    hasFilters: false,
    hasPaging: false,
    hasSorting: false
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new ReadOnlyPage(config);
    page.build();
});