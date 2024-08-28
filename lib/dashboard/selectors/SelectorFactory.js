import AccountSelector from './AccountSelector.js?v=1.1';
import DemandCapabilityLeadSelector from './DemandCapabilityLeadSelector.js?v=1.0';
import DemandCountrySelector from './DemandCountrySelector.js?v=1.0';
import ListSelector from './ListSelector.js?v=1';
import SubRegionSelector from './SubRegionSelector.js?v=1.1';

export default function SelectorFactory(config) {
	switch (config.selectorType) {

		case 'Account':
			return new AccountSelector(config);

		case 'DemandCapabilityLead':
			return new DemandCapabilityLeadSelector(config);

		case 'DemandCountry':
			return new DemandCountrySelector(config);

		case 'Offering':
			return new ListSelector(config);

		case 'SubRegion':
			return new SubRegionSelector(config);

		default:
			return {};

	}

}