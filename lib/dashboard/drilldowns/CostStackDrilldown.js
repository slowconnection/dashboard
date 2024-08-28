import DrilldownBase from './DrilldownBase.js';

export default class CostStackDrilldown extends DrilldownBase {
    constructor(config, filters, clickedItem) {
        super(config, filters);

        this.filters = filters
            .concat(`&filterComponent=${encodeURIComponent(clickedItem.filterComponent)}`)
            .concat(
                (clickedItem.filterColumn === '') ? '' : `&filterColumn=${encodeURIComponent(clickedItem.filterColumn)}`,
                (clickedItem.filterRow === '') ? '' : `&filterRow=${encodeURIComponent(clickedItem.filterRow)}`
            );

        this.url = '/api/GetDrilldownData.asp';
        this.modalWidth = "40%";
        this.modalHeight = "60%";
    }

    async build() {
        try {
            const popupDiv = document.getElementById('drilldownDetail');

            const caption = document.querySelector('#drilldownCaption > span');
            caption.innerText = this.config.header;

            const drilldownContent = document.getElementById('drilldownContent');
            let structure = {
                CostStack7: { width: "20%", cellClass: "" },
                CostStack9: { width: "30%", cellClass: "" },
                Prior: { width: "10%", cellClass: "r", special: ",", placeholder: "[priorFY]" },
                Year: { width: "10%", cellClass: "r", special: ",", placeholder: "[currentFY]" },
                Budget: { width: "10%", cellClass: "r", special: "," },
                YoY: { width: "10%", cellClass: "r", special: "upDownPerc" },
                vsBgt: { width: "10%", cellClass: "r", special: "perc" },
            };
            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}