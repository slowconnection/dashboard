import ChartBase from './ChartBase.js?v=1.0';

export default class HorizontalBarChart extends ChartBase 
{
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'horizontalBar';
    }

    createChart() {
        super.createChart();
        super.addDrilldown();

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
                callbacks: {
                    label: function (tooltipItem, data) {
                        return;
                    },
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function (value) {
                            if ((parseInt(value / divideBy)) >= divideBy) {
                                return Math.round(value / divideBy).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            } else {
                                return value / divideBy;
                            }
                        }
                    },
                    stacked: true
                }],
                yAxes: [{
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
                    formatter: function(value, context) {
                        let reducedValue = value/divideBy;
                        let roundedValue = (reducedValue < 100 && divideBy > 1) ? reducedValue.toFixed(1) : Math.round(reducedValue);
                    
                        let returnValue = roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        if(roundedValue == 0) {
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