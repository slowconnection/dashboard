import AccountOppsDrilldown from './drilldowns/AccountOppsDrilldown.js?v=1.0';
import CapMetricsDrilldown from './drilldowns/CapMetricsDrilldown.js?v=1.0';
import CostStackDrilldown from './drilldowns/CostStackDrilldown.js?v=1.0';
import CostStackQtrDrilldown from './drilldowns/CostStackQtrDrilldown.js?v=1.0';
import DealSizeDrilldown from './drilldowns/DealSizeDrilldown.js?v=1.0';
import HorizonDrilldown from './drilldowns/HorizonDrilldown.js?v=1.0';
import HygieneHzSfDrilldown from './drilldowns/HygieneHzSfDrilldown.js?v=1.0';
import InfoDrilldown from './drilldowns/InfoDrilldown.js?v=1.0';
import PipelineDrilldown from './drilldowns/PipelineDrilldown.js?v=1.0';
import PositionsDrilldown from './drilldowns/PositionsDrilldown.js?v=1.0';
import ProjectsDrilldown from './drilldowns/ProjectsDrilldown.js?v=1.0';
import RevenueHygieneDrilldown from './drilldowns/RevenueHygieneDrilldown.js?v=1.0';
import StandardDrilldown from './drilldowns/StandardDrilldown.js?v=1.0';
import TwoColDrilldown from './drilldowns/TwoColDrilldown.js?v=1.0';
import ZoomDrilldown from './drilldowns/ZoomDrilldown.js?v=1.0';

export default function DrilldownCreator(config, filters, type, clickedItem = null) {
    switch (type) {
        case 'info':
            return new InfoDrilldown(config, `filterComponent=${encodeURIComponent(config.ComponentId)}`);

        case 'CM':
            return new CapMetricsDrilldown(config, filters, clickedItem);

        case 'AccountOpps':
            return new AccountOppsDrilldown(config, filters, clickedItem);

        case 'CostStack':
            return new CostStackDrilldown(config, filters, clickedItem);

        case 'DealSize':
            return new DealSizeDrilldown(config, filters, clickedItem);

        case 'CostStackQtr':
            return new CostStackQtrDrilldown(config, filters, clickedItem);

        case 'HygieneHzSf':
            return new HygieneHzSfDrilldown(config, filters, clickedItem);

        case 'HZ':
            return new HorizonDrilldown(config, filters, clickedItem);

        case 'Positions':
            return new PositionsDrilldown(config, filters, clickedItem);

        case 'Projects':
            return new ProjectsDrilldown(config, filters, clickedItem);

        case 'RevenueHygiene':
            return new RevenueHygieneDrilldown(config, filters, clickedItem);

        case 'SFDC':
            return new PipelineDrilldown(config, filters, clickedItem);

        case 'TwoCol':
            return new TwoColDrilldown(config, filters, clickedItem);

        case 'WR':
            return new WinRateDrilldown(config, filters, clickedItem);

        case 'Zoom':
            return new ZoomDrilldown(config, filters, clickedItem);

        default:
            return new StandardDrilldown(config, filters, clickedItem);
    }

}