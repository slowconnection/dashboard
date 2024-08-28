import SolutioningPage from '/lib/models/pages/SolutioningPage.js';

const config = {
    menuType: 'Standard',
    pagingType: 'Standard',
    detailScreen: 'Solutioning'
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new SolutioningPage(config);
    page.build();
});