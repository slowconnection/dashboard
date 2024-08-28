import ComponentBase from './ComponentBase.js?v=1.0';
import DrilldownCreator from '../DrilldownCreator.js?v=1.0';

export default class ChartBase extends ComponentBase {
    async build() {
        this.data = this.transformChartData();
        this.maxValue = this.getMaxValue(this.data.datasets);
        
        if (this.maxValue === 0) {
            this.showNoDataMessage();

        } else {
            this.divideBy = this.calculateDivideBy(1000000, this.maxValue);

            if (this.config.divideBy != this.divideBy) {
                this.headerElement.innerText = this.fixHeaderText(this.config.divideBy, this.divideBy, this.headerElement.innerText);
            }
            
            this.chartOptions = this.getOptions();

            this.createSidetable();
    
            this.createChart();
        };
    }

    createSidetable() { }

    addDrilldown() {
        var chart = this.chart;
        var config = this.config;
        var filters = this.filters;

        this.canvas.classList.add('chartDrilldown');
        
        this.canvas.onclick = function (evt) {
            const activePoint = chart.getElementAtEvent(evt)[0];
            if (activePoint != undefined) {
                const data = activePoint._chart.data;
                const datasetIndex = activePoint._datasetIndex;
                let clickedItem = {
                    'filterComponent': activePoint._chart.canvas.id.split('-')[2],
                    'filterDataset': datasetIndex,
                    'filterIndex': activePoint._index,
                    // only included for debug purposes
                    'datasetName': data.datasets[datasetIndex].label,
                    'filterLabel': data.labels[activePoint._index],
                    'clickedValue': data.datasets[datasetIndex].data[activePoint._index]
                };

                let componentDrilldown = new DrilldownCreator(config, filters, config.drilldown, clickedItem);
                componentDrilldown.create();
            }
        }
    }

    
    createChart() {
        this.canvas = document.createElement('canvas');
        this.canvas.id=`component-body-${this.config.id}-chart`;
        this.canvas.className = "chart-item";
        if(!this.chartElement) {
            this.chartElement = this.bodyElement;
        }
        this.chartElement.appendChild(this.canvas);

        let ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: this.data,
            options: this.chartOptions
        });

    }

    transformChartData() {
        let labels = [];
        let datasetLabels = [];
        let datasetValues = [];
        let datasets = [];
        let rows = this.json.length;
        const colorMethod = (this.config.colorType === '') ? 'keyword' : this.config.colorType;

        //O(n) solution that is a candidate for refactor.  
        //Iterate SQL rows
        for(let row=0; row<rows; row++) {
            let rowKeys = Object.keys(this.json[row]);
            let rowValues = Object.values(this.json[row]);
            labels.push(rowValues[0]);

            //Iterate SQL columns
            for(let col=1; col<rowKeys.length; col++) {
                if(row == 0) {
                    datasetLabels.push(rowKeys[col]);
                    datasetValues[col-1] = "";
                }
                datasetValues[col-1] += parseInt(rowValues[col]) + "|";
            }
        }

        //Build datasets object (labels, colours and values)
        const cntValues = datasetValues.length;
        for (let i = 0; i < cntValues; i++) {
            let d = datasetValues[i].split('|');
            d = d.splice(0, d.length - 1); //remove trailing entry

            let obj = {
                label: datasetLabels[i],
                backgroundColor: (colorMethod === 'keyword') ? this.config.chartColors.getDatasetColor(datasetLabels[i]) : this.config.chartColors.getStandardColors(rows),
                data: d
            };
            datasets.push(obj);
        }

        return {
            labels: labels,
            datasets: datasets
        };
    }
    


}