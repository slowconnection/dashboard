import DrilldownBase from './DrilldownBase.js';

export default class InfoDrilldown extends DrilldownBase {
    constructor(config, filters) {
        super(config, filters);

        this.modal = document.getElementById('infoModal');
        this.drilldownElement = document.getElementById('infoDetail');
        this.caption = document.querySelector('#infoCaption > span');
        this.drilldownContent = document.getElementById('infoContent');

        this.modalWidth = "650px";
        this.modalHeight = "400px";
    }

    async build() {
        const i = document.createElement('i');
        i.classList.add('fas','fa-info-circle','info');
        i.addEventListener('click', async () => {
            await this.open();
        });
        this.footerElement.appendChild(i);
    }

    // overrides DrilldownBase
    async open() {
        try {
            let id = this.config.ComponentId;
            this.json = await this.repo.getInfoForComponent(id);

            this.showModal();
            this.caption.innerText = `Information about ${this.config.header}`;
            this.drilldownContent.innerHTML = `<div class='narrative'>${this.getNarrativeFromJSON(this.json)}</div>`;

        } catch (err) {
            console.log(err);
        }
    }

}