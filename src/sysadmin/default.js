import SysAdminPage from '/lib/models/pages/_SysAdminPage.js';

//config object to be created on each UI page
document.addEventListener('DOMContentLoaded', () => {
    const page = new SysAdminPage(config);
    page.build();
});

