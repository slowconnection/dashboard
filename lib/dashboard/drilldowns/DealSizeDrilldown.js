import DrilldownBase from './DrilldownBase.js';

export default class DealSizeDrilldown extends DrilldownBase {
    constructor(config, filters, clickedItem) {
        super(config, filters);

        this.filters = filters
            .concat(`&filterComponent=${encodeURIComponent(clickedItem.filterComponent)}`)
            .concat(
                (clickedItem.filterColumn === '') ? '' : `&filterColumn=${encodeURIComponent(clickedItem.filterColumn)}`,
                (clickedItem.filterRow === '') ? '' : `&filterRow=${encodeURIComponent(clickedItem.filterRow)}`
            );

        this.url = '/api/GetDrilldownData.asp';
        this.modalWidth = "60%";
        this.modalHeight = "60%";
    }

    async build() {
        try {
            const popupDiv = document.getElementById('drilldownDetail');

            const caption = document.querySelector('#drilldownCaption > span');
            caption.innerText = this.config.header;

            const drilldownContent = document.getElementById('drilldownContent');
            let structure = {
                OppID: { width: "15%", cellClass: "" },
                Account: { width: "25%", cellClass: "" },
                Opportunity: { width: "26%", cellClass: "" },
                Category: { width: "10%", cellClass: "" },
                DealTCV: { width: "8%", cellClass: "r", special: "," },
                SecTCV: { width: "8%", cellClass: "r", special: "," },
                SecIYR: { width: "8%", cellClass: "r", special: "," },
            };
            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}