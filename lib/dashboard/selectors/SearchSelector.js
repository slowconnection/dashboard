export default class SearchSelector {
    constructor(config) {
        //parent elements
        this.parentId = config.parentId;
        this.selectionId = config.selectionId;
        this.regionId = config.regionId;
        this.selectorType = config.selectorType;
        this.parent = config.parent;
        this.repo = this.parent.repo;

        //DOM elements
        this.field = document.getElementById(this.selectionId);

        //Selector elements
        this.displayValue = null;
        this.value = null;
        this.displayModeElements = [];
        this.changeModeElements = [];
    }
    
    create() {
        this.setDisplayValue();
        this.createElements();
    }


    setDisplayValue() {// needs alternative method for capturing the display value (list doesn't exist yet)
        //const activeValue = this.values.filter(v => v.id == postedValue);
        //this.displayValue = activeValue[0].displayValue;
        //this.value = activeValue[0].id;
        this.displayValue = 'TBA';
        this.value = this.field.value;
    }

    createElements() {
        const container = document.getElementById(this.parentId);
        this.createDisplayModeElements(container);
        this.createChangeModeElements(container);
    }

    createDisplayModeElements(container) {
        const displayValue = this.createDisplayValue();
        const clearSelectionButton = this.createClearSelectionButton();

        this.displayModeElements.push(
            displayValue.id,
            clearSelectionButton.id
        );

        container.appendChild(
            displayValue,
            clearSelectionButton
        );
    }

    createDisplayValue() {
        const id = `${this.selectionId}_displayValue`;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add('value');
        element.innerText = this.displayValue;
        element.addEventListener('click', event => {
            this.changeMode('');
        });
        return element;
    }

    createClearSelectionButton() {
        const id = `${this.selectionId}_clearSelectionButton`;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add('cancelbutton');
        if (this.displayValue === 'ALL') element.classList.add('clear');
        element.innerText = 'X';

        return element;
    }


    createChangeModeElements(container) {
        const searchBox = this.createSearchBox();
        const cancelButton = this.createCancelButton();
        const resultsBox = this.createResultsBox();

        this.changeModeElements.push(
            searchBox.id,
            cancelButton.id,
            resultsBox.id
        );

        container.append(
            searchBox,
            cancelButton,
            resultsBox
        );
    }

    createSearchBox() {
        const id = `${this.selectionId}_searchBox`;
        const element = document.createElement('input');
        element.id = id;
        element.placeholder = `Find ${this.selectorType}`;
        element.classList.add('clear');
        element.autocomplete = "off";

        return element;

    }

    createResultsBox() {
        const id = `${this.selectionId}_resultsBox`;
        const element = document.createElement('div');
        element.id = id;
        element.classList.add('resultsBox', 'input-dropdown-content', 'clear');

        return element;
    }



    createSelectList() {
        const id = `${this.selectionId}_selectList`;
        const element = document.createElement('select');
        element.id = id;
        element.classList.add('clear');
        this.values.forEach(value => {
            const option = document.createElement('option');
            option.textContent = value.displayValue;
            option.value = value.id;
            if (value.id === this.value) option.selected = true;
            element.appendChild(option);
        })

        element.addEventListener('change', (e) => {
            this.select(e);
        });

        return element;

    }

    createCancelButton() {
        const id = `${this.selectionId}_cancelButton`;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add('cancelbutton');
        element.classList.add('clear');
        element.innerText = 'X';

        element.addEventListener('click', event => {
            this.changeMode('cancel');
        })

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

