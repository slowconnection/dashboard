import DrilldownBase from './DrilldownBase.js';

export default class StandardDrilldown extends DrilldownBase {
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
                
            };

            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}