import DrilldownBase from './DrilldownBase.js';

export default class PipelineDrilldown extends DrilldownBase {
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
        this.modalWidth = "80%";
        this.modalHeight = "80%";
    }

    async build() {
        try {
            const popupDiv = document.getElementById('drilldownDetail');

            const caption = document.querySelector('#drilldownCaption > span');
            caption.innerText = this.config.header;
            caption.innerText = 'PipelineDrilldown';

            const drilldownContent = document.getElementById('drilldownContent');
            let structure = {
                OppID: { width: "80px", cellClass: "" },
                Account: { width: "150px", cellClass: "" },
                Opportunity: { width: "150px", cellClass: "" },
                Category: { width: "70px", cellClass: "l" },
                Stage: { width: "70px", cellClass: "l" },
                Decision: { width: "70px", cellClass: "c" },
                TCV: { width: "70px", cellClass: "rb", special:"," },
                ABR: { width: "70px", cellClass: "r", special: "," },
                IYR: { width: "70px", cellClass: "r", special: "," },
                DealTCV: { width: "70px", cellClass: "r", special: "," }
            };

            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}