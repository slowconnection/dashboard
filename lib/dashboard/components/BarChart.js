import ChartBase from './ChartBase.js?v=1.0';


export default class BarChart extends ChartBase {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'bar';
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
                callbacks: {
                   title: (context) => {
                        return context.xLabel;
                    },
                    label: (context) => {
                        var commas = context.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return `${context.xLabel}: ${commas}`;
                    }
                },
                displayColors: false,
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        callback: (value) => this.yAxesTicksCallback(value),
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
                    formatter: (value, context) => this.labelFormatter(value, context),
                    color: '#ffffff'
                }
            }

        }
    }
    
}