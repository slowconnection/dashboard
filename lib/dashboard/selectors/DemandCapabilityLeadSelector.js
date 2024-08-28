import SelectorBase from './SelectorBase.js?v=1.0';

export default class DemandCapabilityLeadSelector extends SelectorBase {
    create() {
        this.prefix = "CL";
        this.selectedItem = 'selectedCapabilityLead';
        this.placeholderText = 'Select Capability Lead';
        this.url = '/api/FindDemandCapabilityLead.asp';

        super.create();
    }
    
   

}

