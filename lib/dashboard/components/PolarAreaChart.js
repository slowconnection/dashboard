import ChartBase from './ChartBase.js?v=1.0';


export default class PolarAreaChart extends ChartBase {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'polarArea';
    }

    createChart() {
        super.createChart();
        //super.addDrilldown();

    }

    
    getOptions() {
        const divideBy = this.divideBy;
        return {
            title: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgba(255,255,255,0.5)',
                    fontSize: 9
                }
            },
            scales: {
                yAxes: {
                    display: false,
                },
                xAxes: {
                    display: false,
                }
            },
            tooltips: {
                displayColors: false,
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