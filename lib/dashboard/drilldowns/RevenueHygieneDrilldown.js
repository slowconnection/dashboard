import DrilldownBase from './DrilldownBase.js';

export default class RevenueHygieneDrilldown extends DrilldownBase {
    constructor(config, filters, clickedItem) {
        super(config, filters);

        this.filters = filters
            .concat(`&filterComponent=${encodeURIComponent(clickedItem.filterComponent)}`)
            .concat(
                (clickedItem.filterDataset === '') ? '' : `&filterDataset=${encodeURIComponent(clickedItem.filterDataset)}`,
                (clickedItem.filterIndex === '') ? '' : `&filterIndex=${encodeURIComponent(clickedItem.filterIndex)}`,
                (clickedItem.filterLabel === '') ? '' : `&filterLabel=${encodeURIComponent(clickedItem.filterLabel)}`
            );

        this.datasetId = clickedItem.filterDataset;
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

            let structure = this.getStructure();

            drilldownContent.innerHTML = await this.buildTable(structure);
            this.showModal(popupDiv);

        } catch (err) {
            this.noDrilldown();
            console.log(err);
        }
    }

    getStructure() {
        const HORIZON = 0;

        if (this.datasetId == HORIZON) {
            return {
                fiscal_period: { width: "6%", cellClass: "" },
                Contract: { width: "23%", cellClass: "" },
                Offering: { width: "15%", cellClass: "" },
                Scenario: { width: "11%", cellClass: "" },
                Type: { width: "11%", cellClass: "" },
                Rev: { width: "5%", cellClass: "r", special: "," },
                Exp: { width: "5%", cellClass: "r", special: "," },
                AOP: { width: "5%", cellClass: "r", special: "," },
            };

        }

        this.modalWidth = "60%";
        this.modalHeight = "60%";
        return {
            OppID: { width: "80px", cellClass: "" },
            Account: { width: "150px", cellClass: "" },
            Opportunity: { width: "150px", cellClass: "" },
            Category: { width: "70px", cellClass: "l" },
            MasterPeriod: { width: "70px", cellClass: "l" },
            fiscal_period: { width: "70px", cellClass: "l" },
            Rev: { width: "70px", cellClass: "rb", special: "," },
        };
    }

}