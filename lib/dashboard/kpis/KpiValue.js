import KpiBase from './KpiBase.js';

export default class KpiValue extends KpiBase {
    build() {
        let outputValue = Object.values(this.json[0]);

        if (outputValue.length === 0) {
            this.bodyElement.innerText = '-';
            this.bodyElement.classList.add('grey');
        } else {
            this.bodyElement.innerText = outputValue;
            const v = outputValue[0].toString();
            if (v != '') {
                if (v.slice(0, 1) == '-') {
                    this.bodyElement.classList.add('negative');
                }
            }
        }

        
    }
}