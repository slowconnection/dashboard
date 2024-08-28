import ChartBase from './ChartBase.js?v=1.0';

export default class DoughnutChart extends ChartBase 
{
    constructor(config, filters) {
        super(config, filters);
        this.chartType = 'doughnut';
    }

    createChart() {
        super.createChart();
        //super.addDrilldown();

    }

    createSidetable() {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        this.bodyElement.appendChild(leftDiv);
        this.chartElement = leftDiv;
        
        const rightDiv = document.createElement('div');
        rightDiv.classList.add('right-div');
        rightDiv.innerHTML = this.getSidetableHtml(); 
        this.bodyElement.appendChild(rightDiv);
    }

    getSidetableHtml() {
        let divideBy = this.divideBy;
        let labels = this.data.labels;
        let values = this.data.datasets[0].data;
        let columnHeader = this.data.datasets[0].label;
        let html = `<div class="table-wrapper"><table><thead><tr><th></th><th style="width:35px">${columnHeader}</th></tr>`;    
    
        for (let i=0; i < labels.length; i++) {
            let reducedValue = values[i]/divideBy;
            let roundedValue = (reducedValue < 100 && divideBy > 1) ? reducedValue.toFixed(1) : Math.round(reducedValue);
            html += `<tr><td style='color:${this.config.chartColors.getStandardColor(i)}'>${labels[i]}</td><td class='r'>${roundedValue}</td></tr>`;
        }
        return html.concat('</table></div>');
    }

    

    getOptions() {
        const divideBy = this.divideBy;
        return {
            title: {
                display: false
            },
            legend: {
                display: false,
            },
            tooltips: {
                displayColors: false,
            },
            plugins: {
                datalabels: {
                    display: function (context) {
                        const value = context.dataset.data[context.dataIndex];
                        return Number(value) > 0;
                    },
                    formatter: function (value, context) {
                        const v = context.dataset.data[context.dataIndex];
                        let reducedValue = v / divideBy;
                        let roundedValue = (reducedValue < 100 && divideBy > 1) ? reducedValue.toFixed(1) : Math.round(reducedValue);

                        let returnValue = roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        if (roundedValue == 0) {
                            return "";
                        }
                        return returnValue;
                    },
                    color: 'white',
                }
            }
        }
    }
}