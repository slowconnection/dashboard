import DrilldownBase from './DrilldownBase.js';

export default class ZoomDrilldown extends DrilldownBase {
    constructor(config, filters) {
        super(config, filters);

        this.modal = document.getElementById('zoomModal');
        this.drilldownElement = document.getElementById('zoomDetail');
        this.caption = document.querySelector('#zoomCaption > span');
        this.drilldownContent = document.getElementById('zoomContent');

        this.modalWidth = "800px";
        this.modalHeight = "488px";
    }

    async build() {
        const i = document.createElement('i');
        i.classList.add('fas','fa-search','info');
        i.addEventListener('click', async () => {
            await this.open();
        });
        this.footerElement.appendChild(i);
    }

    // overrides DrilldownBase
    async open() {
        try {
            let id = this.config.id;
            const header = document.getElementById(`component-header-${id}`);
            const body = document.getElementById(`component-body-${id}`);
            const footer = document.getElementById(`component-footer-${id}`);
            
            this.showModal();
            this.caption.innerHTML = header.innerHTML;

            const canvas = body.querySelectorAll('canvas');
            if (canvas.length > 0) {
                this.drilldownContent.innerHTML = '';
                const newCanvas = document.createElement('canvas');
                const newContext = newCanvas.getContext('2d');
                newContext.scale(2, 2);
                const oldCanvas = canvas[0];
                const oldContext = oldCanvas.getContext('2d');

                newCanvas.width = 600;
                newCanvas.height = 400;

                const img = oldContext.getImageData(0, 0, oldContext.canvas.width, oldContext.canvas.height);
                                
                //newContext.putImageData(img, 0, 0, 0, 0, newCanvas.width, newCanvas.height);
                newContext.drawImage(img, img.width / 4, img.height / 4, img.width / 2, img.height / 2, 0, 0, newCanvas.width, newCanvas.height);
                this.drilldownContent.appendChild(newCanvas);
            } else {
                this.drilldownContent.innerHTML = body.innerHTML;
            }
            console.log(canvas[0].id);
            
            //this.drilldownContent.innerHTML = `<div class='narrative'>${this.getNarrativeFromJSON(this.json)}</div>`;

        } catch (err) {
            console.log(err);
        }
    }

    cloneCanvas() {

    }

}