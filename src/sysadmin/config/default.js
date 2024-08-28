﻿import StandardPage from '/lib/models/pages/StandardPage.js';

const config = {
    pageType: 'Standard',
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Config'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new StandardPage(config);
    page.build();
});