import SelectorBase from './SelectorBase.js?v=1.0';

export default class DemandCountrySelector extends SelectorBase {
    create() {
        this.prefix = "CTRY";
        this.selectedItem = 'selectedCountry';
        this.placeholderText = 'Select Country';
        this.url = '/api/FindDemandCountry.asp';

        super.create();
    }
    
   

}

