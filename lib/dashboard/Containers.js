export default class Containers {
    constructor(components) 
    {
        this.components = Array.from(components);

        this.topSection = document.getElementById("kpi-container");
        this.topComponents = this.components.filter((component) => component.SectionId === 2);

        this.bottomSection = document.getElementById("components-container");
        this.bottomComponents = this.components.filter((component) => component.SectionId === 1);
    }

    create() 
    {
        this.buildTopSection();
        this.buildBottomSection();
    }

    buildTopSection() 
    {
        const template = document.getElementById('kpi-template');
        const cols = Math.floor(this.topSection.offsetWidth / 400);
        const rows = Math.ceil(this.topComponents.length / 10);

        this.topSection.style.gridTemplateColumns = "1fr ".repeat(cols);    
        this.topSection.style.gridTemplateRows = `repeat(${rows}, calc(100vh / ${cols}))`;
    
        const fragment = document.createDocumentFragment();
    
        this.topComponents.map((component) => {
            const headerHTML = ((component.ComponentIcon != "") ? `<i class='${component.ComponentIcon}'></i>&nbsp;` : '').concat(component.header);
            const clone = document.importNode(template.content, true);
            const header = clone.querySelector('header');
            header.id = `kpi-header-${component.id}`;
            header.innerHTML = headerHTML;

            const body = clone.querySelector('section');
            body.id = `kpi-body-${component.id}`;

            fragment.appendChild(clone);
        });

        this.topSection.appendChild(fragment);
    }
    

    buildBottomSection()
    {
        const template = document.getElementById('component-template');
        const cols = Math.floor(this.bottomSection.offsetWidth / 400);
        const rows = Math.ceil(this.bottomComponents.length / 4);

        this.bottomSection.style.gridTemplateColumns = "1fr ".repeat(cols);    
        this.bottomSection.style.gridTemplateRows = `repeat(${rows}, calc(100vh / ${cols}))`;

        const fragment = document.createDocumentFragment();
        this.bottomComponents.map((component) => {
            const headerHTML = ((component.ComponentIcon != "") ? `<i class='${component.ComponentIcon}'></i>&nbsp;` : '').concat(component.header);
            const clone = document.importNode(template.content, true);
            const header = clone.querySelector('header');
            header.id = `component-header-${component.id}`;
            header.innerHTML = headerHTML;

            const body = clone.querySelector('section');
            body.id = `component-body-${component.id}`;

            const footer = clone.querySelector('footer');
            footer.id = `component-footer-${component.id}`;

            //For components with Fixed Region, display this in Footer
            if(component.RegionName != '') {
                const span = document.createElement('span');
                span.classList.add('region');
                span.innerText = component.RegionName;
                footer.appendChild(span);
            }

            fragment.appendChild(clone);
        });

        this.bottomSection.appendChild(fragment);
    }

}