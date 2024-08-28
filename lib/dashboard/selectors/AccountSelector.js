export default class AccountSelector {
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
        const customerName =  (selection.value == '') ? 'ALL' : document.getElementById('selectedAccount').value;

        const displayValue = document.createElement('span');
        displayValue.id = 'AS_displayValue';
        displayValue.classList.add('value');
        displayValue.innerText = customerName;
        container.appendChild(displayValue);

        const searchBox = document.createElement('input');
        searchBox.id = 'AS_searchBox';
        searchBox.placeholder = 'Find Account';
        searchBox.classList.add('findAccount', 'clear');
        searchBox.autocomplete = "off";
        container.appendChild(searchBox);

        const cancelChangeButton = document.createElement('span');
        cancelChangeButton.id = 'AS_cancelButton';
        cancelChangeButton.classList.add('cancelbutton','clear');
        cancelChangeButton.innerText = 'X';
        container.appendChild(cancelChangeButton);

        const resultsBox = document.createElement('div');
        resultsBox.id = 'AS_resultsBox';
        resultsBox.classList.add('resultsBox','input-dropdown-content','clear');
        container.appendChild(resultsBox);

        const clearSelectionButton = document.createElement('span');
        clearSelectionButton.id = 'AS_clearSelectionButton';
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
            this.selectAccount('');
        });

        this.searchBox.addEventListener('keyup', event => {
            this.findAccount(event);
        });
    }

    changeSelection() {
        this.displayValue.classList.add('clear');
        this.searchBox.classList.remove('clear');
        this.cancelChangeButton.classList.remove('clear');
        this.clearSelectionButton.classList.add('clear');
        this.searchBox.focus();
    }

    selectAccount(id) {
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

    findAccount(e) {
        if(this.searchBox.value === '') return;

        if(e.key === 'Escape') {
            this.cancelChange();

        } else {
            const url = `/api/FindAccount.asp?sid=${Math.random()}`;
            const filterRegion = document.getElementById(this.regionId).value;

            let data = new URLSearchParams();
            data.append('searchtext', this.searchBox.value);
            
            //optional fields
            if(filterRegion != '') data.append('filter_region', filterRegion);
            
            let response = fetch (url, {
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
                this.findAccount_callback(data);
            })
            .catch(function(error) {
                console.log(error);
            });
        }

    }

    findAccount_callback(data) {
        // display results in dropdown
        const dropdown = this.resultsBox;

        dropdown.style.display = "block";
        dropdown.innerHTML = "";
        for(let item, i = 0; item = data[i++];) {
            let account = document.createElement("div");
            account.classList.add("resultsItem");
            account.id = `search-${item.client_id}`;
        
            let span = document.createElement("span");
            span.innerHTML = `&nbsp;${item.customer_name}`;

            account.addEventListener("click", () => {
                this.selectAccount(item.client_id);
            });

            account.appendChild(span);
            dropdown.appendChild(account);
        }
    }
    

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

}

