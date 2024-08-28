import DrilldownBase from './DrilldownBase.js';

export default class ProjectsDrilldown extends DrilldownBase {
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
                ID: { width: "2%", cellClass: "" },
                Account: { width: "18%", cellClass: "" },
                Request: { width: "4%", cellClass: "" },
                Engagement: { width: "18%", cellClass: "" },
                Type: { width: "8%", cellClass: "" },
                Project: { width: "", cellClass: "c", special: "RAG" },
                Overall: { width: "", cellClass: "c", special: "RAG" },
                Financial: { width: "", cellClass: "c", special: "RAG" },
                Client: { width: "", cellClass: "c", special: "RAG" },
                Solution: { width: "", cellClass: "c", special: "RAG" },
                Resources: { width: "", cellClass: "c", special: "RAG" },
                Issues: { width: "", cellClass: "c", special: "RAG" },
                Risk: { width: "", cellClass: "c", special: "RAG" },
                engagementStatus: { width: "8%", cellClass: "" },
                Rev: { width: "5%", cellClass: "r", special: "," },
                Cost: { width: "5%", cellClass: "r", special: "," },
            };

            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

}