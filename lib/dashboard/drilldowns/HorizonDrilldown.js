import DrilldownBase from './DrilldownBase.js';

export default class HorizonDrilldown extends DrilldownBase {
    constructor(config, filters, clickedItem) {
        super(config, filters);

        this.filters = filters
            .concat(`&filterComponent=${encodeURIComponent(clickedItem.filterComponent)}`)
            .concat(
                (clickedItem.filterDataset === '') ? '' : `&filterDataset=${encodeURIComponent(clickedItem.filterDataset)}`,
                (clickedItem.filterIndex === '') ? '' : `&filterIndex=${encodeURIComponent(clickedItem.filterIndex)}`,
                (clickedItem.filterLabel === '') ? '' : `&filterLabel=${encodeURIComponent(clickedItem.filterLabel)}`
            );

        this.url = '/api/GetDrilldownData.asp';
        this.modalWidth = "90%";
        this.modalHeight = "90%";
    }

    async build() {
        try {
            const popupDiv = document.getElementById('drilldownDetail');

            const caption = document.querySelector('#drilldownCaption > span');
            caption.innerText = this.config.header;

            const drilldownContent = document.getElementById('drilldownContent');
            let structure = {
                fiscal_period: { width: "6%", cellClass: "" },
                Contract: { width: "23%", cellClass: "" },
                Offering: { width: "15%", cellClass: "" },
                Scenario: { width: "11%", cellClass: "" },
                Type: { width: "11%", cellClass: "" },
                Rev: { width: "5%", cellClass: "r" , special: ","},
                Exp: { width: "5%", cellClass: "r", special: "," },
                AOP: { width: "5%", cellClass: "r", special: "," },
            };

            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}