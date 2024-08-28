import ChartBase from './ChartBase.js?v=1.0';
import DrilldownCreator from '../DrilldownCreator.js?v=1.0';

export default class LineChart extends ChartBase {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'line';
    }

    createChart() {
        super.createChart();

        const colors = this.config.chartColors.getStandardColorsArray();
        const countOfDatasets = this.chart.data.datasets.length;
        for(let i = 0; i < countOfDatasets; i++) {
            this.chart.data.datasets[i].fill = false;
            this.chart.data.datasets[i].backgroundColor = colors[i];
            this.chart.data.datasets[i].borderColor = colors[i];
        }
        this.chart.update();
        super.addDrilldown();

    }

    getOptions() {
        const divideBy = this.divideBy;
        return {
            responsive: true,
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
                    stacked: false
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                          if((parseInt(value/divideBy)) >= divideBy){
                            return Math.round(value/divideBy).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            //return Math.round(value/divideBy).toLocaleString('en');
                          } else {
                            return value/divideBy;
                          }
                        }
                    },
                    stacked: false,
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
                    formatter: function(value) {
                        return value + '\n';
                    },
                    color: '#ffffff'
                }
            }
             
        }
    }
}