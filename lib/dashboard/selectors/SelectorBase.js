export default class SelectorBase {
    constructor(config) {
        //Parent elements
        this.parentId = config.parentId;
        this.selectionId = config.selectionId;
        this.regionId = config.regionId;

            //Selector elements
        this.displayValue = null;
        this.clearSelectionButton = null;
        this.searchBox = null;
        this.resultsBox = null;

        this.prefix = config.prefix || 'SB';
        this.placeholderText = config.placeholderText || 'Choose';
        this.url = config.url || '/api/FindAccount.asp';
    }
    
    create() {
        this.createElements();
        this.addListeners();
    }

    createElements() {
        const container = document.getElementById(this.parentId);
        const selection = document.getElementById(this.selectionId);
        const selectedName = (selection.value == '') ? 'ALL' : document.getElementById(this.selectedItem).value;

        const displayValue = document.createElement('span');
        displayValue.id = `${this.prefix}_displayValue`;
        displayValue.classList.add('value');
        displayValue.innerText = selectedName;
        container.appendChild(displayValue);

        const searchBox = document.createElement('input');
        searchBox.id = `${this.prefix}_searchBox`;
        searchBox.placeholder = this.placeholderText;
        searchBox.classList.add('findCountry', 'clear');
        container.appendChild(searchBox);

        const cancelChangeButton = document.createElement('span');
        cancelChangeButton.id = `${this.prefix}_cancelButton`;
        cancelChangeButton.classList.add('cancelbutton', 'clear');
        cancelChangeButton.innerText = 'X';
        container.appendChild(cancelChangeButton);

        const resultsBox = document.createElement('div');
        resultsBox.id = `${this.prefix}_resultsBox`;
        resultsBox.classList.add('resultsBox', 'input-dropdown-content', 'clear');
        container.appendChild(resultsBox);

        const clearSelectionButton = document.createElement('span');
        clearSelectionButton.id = `${this.prefix}_clearSelectionButton`;
        clearSelectionButton.classList.add('cancelbutton');
        if (selectedName === 'ALL') clearSelectionButton.classList.add('clear');
        clearSelectionButton.innerText = 'X';
        container.appendChild(clearSelectionButton);

        this.displayValue = displayValue;
        this.searchBox = searchBox;
        this.cancelChangeButton = cancelChangeButton;
        this.resultsBox = resultsBox;
        this.clearSelectionButton = clearSelectionButton;
    }
    
    
    addListeners() {
        this.displayValue.addEventListener('click', event => {
            this.changeSelection();
        });

        this.cancelChangeButton.addEventListener('click', event => {
            this.cancelChange();
        });

        this.clearSelectionButton.addEventListener('click', event => {
            this.select('');
        });

        this.searchBox.addEventListener('keyup', event => {
            this.find(event);
        });
    }

    changeSelection() {
        this.displayValue.classList.add('clear');
        this.searchBox.classList.remove('clear');
        this.cancelChangeButton.classList.remove('clear');
        this.clearSelectionButton.classList.add('clear');
        this.searchBox.focus();
    }

    select(id) {
        const selection = document.getElementById(this.selectionId);
        selection.value = id;
        document.forms[0].submit();
    }

    cancelChange() {
        const selection = document.getElementById(this.selectionId);
        this.displayValue.classList.remove('clear');
        if(selection.value !== '') {
            this.clearSelectionButton.classList.remove('clear');
        }
        this.searchBox.classList.add('clear');
        this.resultsBox.classList.add('clear');
        this.resultsBox.style.display = 'none';
        this.resultsBox.innerHTML = '';
        this.cancelChangeButton.classList.add('clear');
    }

    find(e) {
        if(this.searchBox.value === '') return;

        if(e.key === 'Escape') {
            this.cancelChange();

        } else {
            const url = `${this.url}?sid=${Math.random()}`;

            let data = new URLSearchParams();
            data.append('searchtext', this.searchBox.value);

            if (document.getElementById(this.regionId)) {
                const filterRegion = document.getElementById(this.regionId).value;
                if (filterRegion != '') data.append('filter_region', filterRegion);
            }
            console.log([url, this.searchBox.value]);
            let response = fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: data
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.find_callback(data);
            })
            .catch(function(error) {
                console.log(error);
            });
        }

    }

    find_callback(data) {
        // display results in dropdown
        const dropdown = this.resultsBox;

        dropdown.style.display = "block";
        dropdown.innerHTML = "";
        for(let item, i = 0; item = data[i++];) {
            let resultsItem = document.createElement("div");
            resultsItem.classList.add("resultsItem");
            resultsItem.id = `search-${item.itemId}`;
        
            let span = document.createElement("span");
            span.innerHTML = `&nbsp;${item.itemValue}`;

            span.addEventListener("click", () => {
                this.select(item.itemId);
            });

            resultsItem.appendChild(span);
            dropdown.appendChild(resultsItem);
        }
    }
    

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

}

