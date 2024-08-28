import DrilldownBase from './DrilldownBase.js';

export default class PositionsDrilldown extends DrilldownBase {
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
                EID: { width: "4%", cellClass: "" },
                Employee: { width: "10%", cellClass: "" },
                Region: { width: "3%", cellClass: "" },
                Capability: { width: "4%", cellClass: "" },
                Project: { width: "29%", cellClass: "" },
                Position: { width: "4%", cellClass: "" },
                PositionName: { width: "", cellClass: "" },
                Type: { width: "6%", cellClass: "" },
                Status: { width: "4%", cellClass: "" },
                StartDate: { width: "4%", cellClass: "c" },
                FinishDate: { width: "4%", cellClass: "c" },
                FTE: { width: "2%", cellClass: "c"},
            };

            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}