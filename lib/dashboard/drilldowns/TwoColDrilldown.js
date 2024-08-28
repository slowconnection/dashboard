import DrilldownBase from './DrilldownBase.js';


export default class TwoColDrilldown extends DrilldownBase {
    constructor(config, filters, clickedItem) {
        super(config, filters);

        this.filters = filters
            .concat(`&filterComponent=${encodeURIComponent(clickedItem.filterComponent)}`)
            .concat(
                (isNaN(clickedItem.filterDataset)) ? '' : `&filterDataset=${encodeURIComponent(clickedItem.filterDataset)}`,
                (isNaN(clickedItem.filterIndex)) ? '' : `&filterIndex=${encodeURIComponent(clickedItem.filterIndex)}`,
                (clickedItem.filterLabel === '') ? '' : `&filterLabel=${encodeURIComponent(clickedItem.filterLabel)}`
        );

        this.url = '/api/GetDrilldownData.asp';
        this.modalWidth = "400px";
        this.modalHeight = "250px";
    }

    async build() {
        try {
            const popupDiv = document.getElementById('drilldownDetail');

            const caption = document.querySelector('#drilldownCaption > span');
            caption.innerText = this.config.header;

            const drilldownContent = document.getElementById('drilldownContent');
            drilldownContent.innerHTML = await this.buildTwoColTable();
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}