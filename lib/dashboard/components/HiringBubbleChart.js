import BubbleChart from './BubbleChart.js?v=1.0';

export default class HiringBubbleChart extends BubbleChart {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'bubble';
    }

    //Overrides Bubble
    transformChartData() {
        const firstRow = this.json[0];
        const rows = this.json.length;
        let red = [];
        let amber = [];
        let green = [];

        if (firstRow.hasOwnProperty("x") && firstRow.hasOwnProperty("y") && firstRow.hasOwnProperty("r")) {
            //establish maximum value
            let maxValue = 0;
            for (let row = 0; row < rows; row++) {
                if (this.json[row].r > maxValue) {
                    maxValue = this.json[row].r;
                }
            }
            this.bubbleSize = 1;
            if (maxValue < 10) {
                this.bubbleSize = 10;
            }
      
            for (let row = 0; row < rows; row++) {
                let x = this.json[row].x;
                let y = this.json[row].y;
                let r = this.json[row].r * this.bubbleSize;

                if (x > 0) {
                    red.push({ x, y, r });
                } else {
                    if (x === 0) {
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
                    label: 'Future',
                    data: green,
                    backgroundColor: 'rgba(0, 255, 0, 0.4)',
                    borderColor: 'rgb(0, 255, 0)',
                },
                {
                    label: 'Due',
                    data: amber,
                    backgroundColor: 'rgba(255, 191, 0, 0.4)',
                    borderColor: 'rgb(255, 191, 0)',
                },
                {
                    label: 'Over 30 days',
                    data: red,
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                    borderColor: 'rgb(255, 0, 0)',
                }
            ],
        };
    }


    //Overrides BubbleChart
    getOptions() {
        
        const bubbleSize = this.bubbleSize;

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
                            const ix = tooltipItem.yLabel - 1;
                            const labels = ['Due to start in over 120 days',
                                'Due to start between 90 and 119 days',
                                'Due to start between 60 and 89 days',
                                'Due to start between 30 and 59 days',
                                'Due to start in the next 29 days',
                                'Overdue by up to 29 days',
                                'Overdue by between 30 and 59 days',
                                'Overdue by between 60 and 89 days',
                                'Overdue by between 90 and 119 days',
                                'Overdue by over 120 days'
                            ];
                            

                            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].r;
                            const displayValue = Number(value) / bubbleSize;
                            const label = `     # of Positions ${labels[ix]} : ${displayValue}`;
                            
                            return label;

                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            },
            plugins: {
                datalabels: {
                    display: function (context) {
                        const value = context.dataset.data[context.dataIndex].r;
                        return Number(value) > 0;
                    },
                    formatter: function (value, context) {
                        const v = context.dataset.data[context.dataIndex].r;
                        return v / bubbleSize;
                    },
                    color: 'white',
                }
            }

        }
    }
    
}