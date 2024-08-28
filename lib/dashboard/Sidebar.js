import Repo from './Repo.js?v=1.0';

export default class Sidebar {
    constructor(DashboardTypeId = 1, filterGroup = '') {
        this.container = document.querySelector('.dashboard-sidebar');
        this.url = '/api/GetDashboardSidebar.asp';
        //this.filters = `DashboardTypeId=${encodeURIComponent(DashboardTypeId)}`;

        this.filters = `DashboardTypeId=${encodeURIComponent(DashboardTypeId)}`.concat(
            (filterGroup === '') ? '' : `&filterGroup=${encodeURIComponent(filterGroup)}`
        );

        this.repo = new Repo();
        this.DashboardTypeId = DashboardTypeId;
    }

    async create() {
        const components = await this.getSidebarJson();
    
        const sections = Array.from(new Set(components.map(data => data.Section)));
        sections.forEach((section) => {
            const activeFilter = document.querySelector(`#filter_${section}`).value;
            const sectionComponents = components.filter((component) => component.Section == section);
            this.container.appendChild(
                this.buildSidebarList(section, sectionComponents, activeFilter)
            );
        });

        this.sidebarRegions();
    }

    async getSidebarJson() {
        const json = await this.repo.getDataAsync(this.url, this.filters);
        return json;
    }


    buildSidebarList(section, components, currentid) {
        const div = document.createElement('div');
        div.className = 'dashboard-selector';

        const ul = document.createElement('ul');
        ul.id = `sidebar-${section}`;
        ul.addEventListener('click', (e) => {
            this.sidebarHandler(e.target);
        });

        const html = components.map((component) => {
            return `<li id='${ul.id}-${component.Id}' class='${ul.id}-element ${(component.Id == currentid) ? ' selected' : ''}'>${component.Title}</li>`;
        });
    
        ul.innerHTML = html.join('');

        const title = document.createElement('span');
        title.className = 'sidebar-title';
        title.innerHTML = this.titleCase(section);
        div.appendChild(title);

        div.appendChild(ul);
    
        return div;
    }

    sidebarHandler(el) {
        const selectedFilter = `${el.id.split('-')[1]}`;
        const selectedValue = `${el.id.split('-')[2]}`;
    
        document.querySelector(`#filter_${selectedFilter}`).value = selectedValue;
        document.forms[0].submit();
    }

    sidebarRegions() {
        //if user can only view 1 region, ensure that this is selected/highlighted
        const regions = document.querySelectorAll('.sidebar-region-element');
        if(regions.length === 1) {
            document.getElementById('filter_region').value = regions[0].id.replace('sidebar-region-','');
            regions[0].classList.add('selected');
        }
    }

    titleCase(str) {
      return str.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    }



}