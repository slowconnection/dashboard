export default class ChartColors {
    getDatasetColor(label) {
        const m = new Map()
            .set('Won', 'rgba(0,204,34,0.4)')
            .set('Actual', 'rgba(0,204,34,0.4)')
            .set('Secured', 'rgba(0,204,34,0.8)')
            .set('Backlog', 'rgba(0,204,34,0.8)')
            .set('Forecast', 'rgba(255,170,0,0.8)')
            .set('Fcst', 'rgba(255,170,0,0.8)')
            .set('Unsecured', 'rgba(255,170,0,0.8)')
            .set('Sell_Bill', 'rgba(255,170,0,0.8)')
            .set('HZ', 'rgba(255,170,0,0.8)')
            .set('Pipeline', 'rgba(100,100,100,0.8)')
            .set('SFDC', 'rgba(91,245,230,0.6)')
            .set('Pipe', 'rgba(100,100,100,0.8)')
            .set('Qualified', 'rgba(100,100,100,0.8)')
            .set('Unqualified', 'rgba(100,100,100,0.4)')
            .set('Account Chargeable', 'rgba(51,119,255,0.8)')
            .set('Internal Chargeable', 'rgba(51,119,255,0.4)')
            .set('Green', 'rgba(0,204,34,0.4)')
            .set('Yellow', 'rgba(255,170,0,0.8)')
            .set('Red', 'rgba(255,0,0,0.8)')
            .set('FTE', 'rgba(70,130,180,0.8)')
            .set('Others', 'rgba(70,130,180,0.4)')
            .set('Security', 'rgba(0,204,34,0.4)')
            .set('#', 'rgba(45,94,217,0.8)')
            .set('Internal', 'rgba(51,119,255,0.8)')
            .set('External', 'rgba(51,119,255,0.4)')
            .set('MEP', 'rgba(0,204,34,0.4)')
            .set('EDR', 'rgba(255,170,0,0.8)')
            .set('Future', 'rgba(0,204,34,0.4)')
            .set('Due', 'rgba(255,170,0,0.8)')
            .set('Overdue', 'rgba(255,0,0,0.8)');

        return (m.has(label)) ? m.get(label) : 'rgba(200,200,200,0.5)';
    }

    getStandardColors(cnt) {
        return this.getStandardColorsArray().slice(0, cnt);
    }

    getStandardColor(i) {
        return this.getStandardColorsArray()[i];
    }

    getStandardColorsArray() {
        return ['rgba(91,245,230,0.8)','rgba(60,179,113,0.8)','rgba(238,130,238,0.8)',
                'rgba(255,165,0,0.8)','rgba(153,91,245,0.8)','rgba(183,245,91,0.8)',
                'rgba(120,120,120,0.8)','rgba(180,180,180,0.8)'];
    }
}