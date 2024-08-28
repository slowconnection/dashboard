import DrilldownBase from './DrilldownBase.js';

export default class CapMetricsDrilldown extends DrilldownBase {
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
                Source: { width: "80px", class: "" },
                Submission: { width: "80px", class: "" },
                Submitter: { width: "150px", class: "" },
                Prior: { width: "70px", class: "r" },
                Metric: { width: "70px", class: "r" },
                MoM: { width: "70px", class: "c" }
            };
            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }

    }


    


}