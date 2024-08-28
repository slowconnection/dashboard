import ChartBase from './ChartBase.js?v=1.0';

export default class BubbleChart extends ChartBase {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'bubble';
    }

    //Overrides ChartBase
    async build() {
        this.data = this.transformChartData();
        this.maxValue = 1;
        //this.minValue = -200;
        //this.maxValue = this.getMaxValue(this.data.datasets);

        if (this.maxValue === 0) {
            this.showNoDataMessage();

        } else {
            this.chartOptions = this.getOptions();
            this.createChart();
        };
    }

    //Overrides ChartBase
    transformChartData() {
        const firstRow = this.json[0];
        const rows = this.json.length;
        let red = [];
        let amber = [];
        let green = [];

        if (firstRow.hasOwnProperty("x") && firstRow.hasOwnProperty("y") && firstRow.hasOwnProperty("r")) {
      
            for (let row = 0; row < rows; row++) {
                let x = this.json[row].x;
                let y = this.json[row].y;
                let r = this.json[row].r;

                if (x < 0) {
                    red.push({ x, y, r });
                } else {
                    if (x < 30) {
                        amber.push({ x, y, r });
                    } else {
                        green.push({ x, y, r });
                    }
                }
            }

        };

        return {
            datasets: [
                {
                    label: 'Over 30 days',
                    data: red,
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                    borderColor: 'rgb(255, 0, 0)',
                },
                {
                    label: 'Due',
                    data: amber,
                    backgroundColor: 'rgba(255, 191, 0, 0.4)',
                    borderColor: 'rgb(255, 191, 0)',
                },
                {
                    label: 'Future',
                    data: green,
                    backgroundColor: 'rgba(0, 255, 0, 0.4)',
                    borderColor: 'rgb(0, 255, 0)',
                }
            ],
        };
    }

    createChart() {
        super.createChart();
        //super.addDrilldown();

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
                    label: function (tooltipItem, data) {
                        try {
                            const x = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x;
                            const prefix = (Number(x) < 0) ? '' : 'in ';
                            const suffix = (Number(x) < 0) ? ' ago' : '';

                            const date = new Date();
                            date.setDate(date.getDate() + x);

                            let label = `     # of Positions due to start ${prefix}${Math.abs(x)} days${suffix}`;

                            if (label) {
                                label += ': ';
                            }

                            //const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
                            //    return accumulator + curValue;
                            //});
                            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].r;

                            label += Number(value);
                            return label;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            },
            plugins: {
                datalabels: {
                    color: 'white',
                }
            }

        }
    }
    
}