import AreaChart from './components/AreaChart.js?v=0.1';
import BarChart from './components/BarChart.js?v=0.1';
import BubbleChart from './components/BubbleChart.js?v=0.1';
import HiringBubbleChart from './components/HiringBubbleChart.js?v=0.1';
import ComboChart from './components/ComboChart.js?v=0.1';
import DoughnutChart from './components/DoughnutChart.js?v=1.0';
import HorizontalBarChart from './components/HorizontalBarChart.js?v=1.0';
import HorizontalBarNoLabelsChart from './components/HorizontalBarNoLabelsChart.js?v=1.0';
import LineChart from './components/LineChart.js?v=1.0';
import PieChart from './components/PieChart.js?v=1.0';
import PolarAreaChart from './components/PolarAreaChart.js?v=1.0';
import ScatterChart from './components/ScatterChart.js?v=1.0';
import UnstackedBarChart from './components/UnstackedBarChart.js?v=0.1';

import Table from './components/Table.js?v=1.0';
import TableWithDrilldown from './components/TableWithDrilldown.js?v=1.0';
import MatrixTable from './components/MatrixTable.js?v=1.0';

import KpiValue from './kpis/KpiValue.js?v=1.1';

export default function ComponentCreator(config) {
    switch (config.type) {
        //Chart classes
        case 'area':
            return new AreaChart(config);
        case 'bar':
            return new BarChart(config);
        case 'bubble':
            return new BubbleChart(config);
        case 'combo':
            return new ComboChart(config);
        case 'doughnut':
            return new DoughnutChart(config);
        case 'hiringBubble':
            return new HiringBubbleChart(config);
        case 'horizontalBar':
            return new HorizontalBarChart(config);
        case 'horizontalBarNoLabels':
            return new HorizontalBarNoLabelsChart(config);
        case 'line':
            return new LineChart(config);
        case 'pie':
            return new PieChart(config);
        case 'polarArea':
            return new PolarAreaChart(config);
        case 'scatter':
            return new ScatterChart(config);
        case 'unstackedBar':
            return new UnstackedBarChart(config);

        //Table classes
        case 'table':
            return new Table(config);
        case 'matrixTable':
            return new MatrixTable(config);
        case 'tableWithDrilldown':
            return new TableWithDrilldown(config);

        //KPI classes
        case 'kpi':
            return new KpiValue(config);

        default:
            return new Error();
    }

}