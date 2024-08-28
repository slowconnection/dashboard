import ChartBase from './ChartBase.js?v=1.0';

export default class HorizontalBarNoLabelsChart extends ChartBase 
{
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'horizontalBar';
    }

    createChart() {
        super.createChart();
        super.addDrilldown();

    }

    labelFormatter(value, context) {
        let reducedValue = value / this.divideBy;
        let roundedValue = (reducedValue < 100 && this.divideBy > 1) ? reducedValue.toFixed(1) : Math.round(reducedValue);

        let returnValue = roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (roundedValue == 0) {
            return "";
        }
        return returnValue;
    }

    yAxesTicksCallback(value) {
        if ((parseInt(value / this.divideBy)) >= this.divideBy) {
            return Math.round(value / this.divideBy).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return value / this.divideBy;
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
                        //console.log([tooltipItem, data]);
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
                datalabels: false,
                
            }
             
        }
    }
}