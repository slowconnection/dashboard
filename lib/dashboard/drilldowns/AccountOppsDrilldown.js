import DrilldownBase from './DrilldownBase.js';

export default class AccountOppsDrilldownQtr extends DrilldownBase {
    constructor(config, filters, clickedItem) {
        super(config, filters);

        this.filters = filters
            .concat(`&filterComponent=${encodeURIComponent(clickedItem.filterComponent)}`)
            .concat(
                (clickedItem.filterColumn === '') ? '' : `&filterColumn=${encodeURIComponent(clickedItem.filterColumn)}`,
                (clickedItem.filterRow === '') ? '' : `&filterRow=${encodeURIComponent(clickedItem.filterRow)}`
            );

        this.url = '/api/GetDrilldownData.asp';
        this.modalWidth = "50%";
        this.modalHeight = "50%";
    }

    async build() {
        try {
            const popupDiv = document.getElementById('drilldownDetail');

            const caption = document.querySelector('#drilldownCaption > span');
            caption.innerText = this.config.header;

            const drilldownContent = document.getElementById('drilldownContent');
            let structure = {
                OppId: { width: "10%", cellClass: "" },
                OppName: { width: "58%", cellClass: "" },
                ClientId: { width: "8%", cellClass: "c" },
                FQ: { width: "8%", cellClass: "c" },
                Category: { width: "8%", cellClass: "" },
                TCV: { width: "8%", cellClass: "r", special: "," },
            };
            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}