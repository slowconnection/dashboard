import ChartBase from './ChartBase.js?v=1.0';
import DrilldownCreator from '../DrilldownCreator.js?v=1.0';

export default class ComboChart extends ChartBase {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'bar';
    }

    //Overrides parent so that the dataset can be manipulated
    async build() {
        this.data = this.transformChartData();
        this.convertLastDatasetToLine();
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

    convertLastDatasetToLine() {
        let ds = this.data.datasets.length;
        if (ds > 1) {
            for (var i = 0; i < ds; i++) {
                this.data.datasets[i].order = i + 1;
            }
            ds -= 1;
            this.data.datasets[ds].type = 'line';
            this.data.datasets[ds].borderColor = 'red';
            this.data.datasets[ds].backgroundColor = 'rgba(0,0,0,0)';
            this.data.datasets[ds].tension = 0;
            this.data.datasets[ds].order = 0;
        }
    }

    createChart() {
        super.createChart();
        this.addDrilldown();

    }

    addDrilldown() {
        var chart = this.chart;
        var config = this.config;
        var filters = this.filters;
      
        this.canvas.classList.add('chartDrilldown');

        this.canvas.onclick = function(evt) {
            const activePoint = chart.getElementAtEvent(evt)[0];
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

    getOptions() {
        const divideBy = this.divideBy;
        return {
            title: {
                display: false
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgba(255,255,255,0.5)',
                    fontSize: 9
                }
            },
            tooltips: {
                displayColors: false,
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            if ((parseInt(value / divideBy)) >= divideBy) {
                                return Math.round(value / divideBy).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            } else {
                                return value / divideBy;
                            }
                        }
                    },
                    stacked: true,
                    scaleShowGridLines: true,
                    gridLines: {
                        display: true,
                        drawBorder: false,
                        zeroLineColor: 'rgba(0,0,0,1)',
                        zeroLineWidth: 2
                    }
                }]
            },
            plugins: {
                datalabels: {
                    formatter: function (value, context) {

                        let reducedValue = value / divideBy;
                        let roundedValue = (reducedValue < 100 && divideBy > 1) ? reducedValue.toFixed(1) : Math.round(reducedValue);

                        let returnValue = roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        if (roundedValue == 0) {
                            return "";
                        }
                        return returnValue;
                    },
                    color: '#ffffff'
                }
            }

        }
    }
    
}