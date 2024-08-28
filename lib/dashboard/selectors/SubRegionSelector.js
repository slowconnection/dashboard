export default class SubRegionSelector {
    constructor(config) {
        //parent elements
        this.parentId = config.parentId,
        this.selectionId = config.selectionId,
        this.regionId = config.regionId,

        //Account Selector elements
        this.displayValue = null,
        this.clearSelectionButton = null,
        this.searchBox = null,
        this.resultsBox = null

    }
    
    create() {
        this.createElements();
        this.addListeners();
    }

    createElements() {
        const container = document.getElementById(this.parentId);
        const selection = document.getElementById(this.selectionId);
        //const filter = `filterAccount=${encodeURIComponent(selection.value)}`;
        const customerName =  (selection.value == '') ? 'ALL' : document.getElementById('selectedSubRegion').value;

        const displayValue = document.createElement('span');
        displayValue.id = 'SRS_displayValue';
        displayValue.classList.add('value');
        displayValue.innerText = customerName;
        container.appendChild(displayValue);

        const searchBox = document.createElement('input');
        searchBox.id = 'SRS_searchBox';
        searchBox.placeholder = 'Find Sub-region';
        searchBox.classList.add('findSubRegion', 'clear');
        searchBox.autocomplete = "off";
        container.appendChild(searchBox);

        const cancelChangeButton = document.createElement('span');
        cancelChangeButton.id = 'SRS_cancelButton';
        cancelChangeButton.classList.add('cancelbutton','clear');
        cancelChangeButton.innerText = 'X';
        container.appendChild(cancelChangeButton);

        const resultsBox = document.createElement('div');
        resultsBox.id = 'SRS_resultsBox';
        resultsBox.classList.add('resultsBox','input-dropdown-content','clear');
        container.appendChild(resultsBox);

        const clearSelectionButton = document.createElement('span');
        clearSelectionButton.id = 'SRS_clearSelectionButton';
        clearSelectionButton.classList.add('cancelbutton');
        if(customerName === 'ALL') clearSelectionButton.classList.add('clear');
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
            this.selectSubRegion('');
        });

        this.searchBox.addEventListener('keyup', event => {
            this.findSubRegion(event);
        });
    }

    changeSelection() {
        this.displayValue.classList.add('clear');
        this.searchBox.classList.remove('clear');
        this.cancelChangeButton.classList.remove('clear');
        this.clearSelectionButton.classList.add('clear');
        this.searchBox.focus();
    }

    selectSubRegion(id) {
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

    findSubRegion(e) {
        if(this.searchBox.value === '') return;

        if(e.key === 'Escape') {
            this.cancelChange();

        } else {
            const url = `/api/FindSubRegion.asp?sid=${Math.random()}`;
            const filterRegion = document.getElementById(this.regionId).value;

            let data = new URLSearchParams();
            data.append('searchtext', this.searchBox.value);
            
            //optional fields
            if(filterRegion != '') data.append('filter_region', filterRegion);
            
            fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: data
            })
            //.then(this.handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.findSubRegion_callback(data);
            })
            .catch(function(error) {
                console.log(error);
            });
        }

    }

    findSubRegion_callback(data) {
        // display results in dropdown
        const dropdown = this.resultsBox;

        dropdown.style.display = "block";
        dropdown.innerHTML = "";
        for(let item, i = 0; item = data[i++];) {
            let subRegion = document.createElement("div");
            subRegion.classList.add("resultsItem");
            subRegion.id = `search-${item.id}`;
        
            let span = document.createElement("span");
            span.innerHTML = `&nbsp;${item.subregion_name}`;

            subRegion.addEventListener("click", () => {
                this.selectSubRegion(item.id);
            });

            subRegion.appendChild(span);
            dropdown.appendChild(subRegion);
        }
    }
    

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

}

