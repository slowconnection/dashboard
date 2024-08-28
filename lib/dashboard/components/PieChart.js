import ChartBase from './ChartBase.js?v=1.0';

export default class PieChart extends ChartBase {
    async build() {
        console.log('Pie Chart', this.json);
    }
}