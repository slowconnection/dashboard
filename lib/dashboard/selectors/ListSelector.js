export default class ListSelector {

    constructor(config) {
        //parent elements
        this.parentId = config.parentId;
        this.selectionId = config.selectionId;
        this.regionId = config.regionId;
        this.listName = config.listName;
        this.parent = config.parent;
        this.repo = this.parent.repo;

        //DOM elements
        this.field = document.getElementById(this.selectionId);
        this.selectList = {};

        //Selector elements
        this.displayValue = null;
        this.value = null;
        this.displayModeElements = [];
        this.changeModeElements = [];
    }
    
    create() {
        this.getValues()
            .then(result => {
                this.values = [{ id: '', displayValue: 'ALL' }, ...result];
                this.setDisplayValue();
                this.createElements();
            })
            .catch(error => {
                console.log(error);
            });

    }

    async getValues() {
        return this.repo.getValueList(this.listName);
    }

    setDisplayValue() {
        const postedValue = this.field.value;
        const activeValue = this.values.filter((v) => v.id == postedValue);
        this.displayValue = activeValue[0].displayValue;
        this.value = activeValue[0].id;
    }

    createElements() {
        const container = document.getElementById(this.parentId);
        this.createDisplayModeElements(container);
        this.createChangeModeElements(container);
    }

    createDisplayModeElements(container) {
        const displayValue = this.createDisplayValue();

        this.displayModeElements.push(displayValue.id);

        container.appendChild(displayValue);
    }

    createDisplayValue() {
        const id = `_${this.selectionId}_displayValue`;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add('value');
        element.innerText = this.displayValue;
        element.addEventListener('click', () => this.changeMode(''));
        return element;
    }


    createChangeModeElements(container) {
        this.selectList = this.createSelectList();
        const cancelButton = this.createCancelButton();

        this.changeModeElements.push(this.selectList.id, cancelButton.id);

        container.appendChild(this.selectList);
        container.appendChild(cancelButton);
    }

    createSelectList() {
        const id = `_${this.selectionId}_selectList`;
        const element = document.createElement('select');
        element.id = id;
        element.classList.add('clear');
        this.values.forEach((value) => {
            const option = document.createElement('option');
            option.textContent = value.displayValue;
            option.value = value.id;
            if (value.id === this.value) option.selected = true;
            element.appendChild(option);
        })

        element.addEventListener('change', (e) => this.select(e));

        return element;

    }

    createCancelButton() {
        const id = `_${this.selectionId}_cancelButton`;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add('cancelbutton');
        element.classList.add('clear');
        element.innerText = 'X';

        element.addEventListener('click', () => this.changeMode('cancel'));

        return element;
    }
    
    changeMode(newMode) {
        if (newMode === '') {
            this.displayModeElements.forEach(element => document.getElementById(element).classList.add('clear'));
            this.changeModeElements.forEach(element => document.getElementById(element).classList.remove('clear'));
        } else {
            this.displayModeElements.forEach(element => document.getElementById(element).classList.remove('clear'));
            this.changeModeElements.forEach(element => document.getElementById(element).classList.add('clear'));
        }
    }

    select(e) {
        if (this.value === this.selectList.value) {
            this.changeMode('');
        } else {
            this.field.value = this.selectList.value;
            document.forms[0].submit();
        }
    }
    

}

