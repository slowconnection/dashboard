import ChartBase from './ChartBase.js?v=1.0';


export default class ScatterChart extends ChartBase {
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'scatter';
    }

    createChart() {
        super.createChart();
        super.addDrilldown();

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

        }
    }
    
}