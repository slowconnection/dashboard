// Must have "code behind" (e.g. Solutioning)
class Page {
    constructor(e) {
        this.Id = e.id;
        this.MenuId = "#menu";
        this.drilldown_id = e.drilldown_id,
        this.drilldown_filename = e.drilldown_filename, //"solutioning",
        this.drilldown_fieldname = e.drilldown_fieldname, //"opportunityid",
        this.drilldown_miscvalues = e.drilldown_miscvalues,
        this.drilldown_callback = e.drilldown_callback,
        this.drilldown_submitid = e.drilldown_submitid || 'btnDrilldownSubmit',
        this.drilldown_submitcallback = e.drilldown_submitcallback
    }

    // Menu section
        buildMenu() {
            this.createMenu();
            this.addMenuListeners(); 
            this.styleSelectElements();
        }

        addMenuListeners() {
            const nav = document.querySelector(this.MenuId);
        
            //dropdown handler
                nav.addEventListener("mouseover", (e) => {
                const m = e.target.id;

                //if header
                if(m.startsWith('mh_')) {
                    const drilldownToShow = m.replace("mh_", "md_");
                    const drilldownToHide_log = document.querySelector("#activeMenuHeader");
                    const drilldownToHide = drilldownToHide_log.value;
                    const drilldownToShow_ui = document.querySelector(`#${drilldownToShow}`);

                    if(drilldownToShow != drilldownToHide) {
                        if(!(drilldownToHide === "")) {
                            const drilldownToHide_ui = document.querySelector(`#${drilldownToHide}`);
                            drilldownToHide_ui.style.display = "none";
                        }
                        drilldownToShow_ui.style.display = "block";
                        drilldownToHide_log.value = drilldownToShow;
                    }

                }

            });
      
            //hide dropdown on click (unless the click was on a link)
            document.addEventListener("click", (e) => {
                const drilldownToHide_log = document.querySelector("#activeMenuHeader");
                const drilldownToHide = drilldownToHide_log.value;
                if (drilldownToHide != "") {
                    const drilldownToHide_ui = document.querySelector(`#${drilldownToHide}`);
                    drilldownToHide_ui.style.display = "none";
                    drilldownToHide_log.value = "";
                }
      
            });
        }

        createMenu() {
            const menuJSON = `/api/ListMenuItems.asp?cp=${this.Id}`;
            const nav = document.querySelector(this.MenuId);
            let objHeaders = {};
            let arrHeaders = [];
            let arrItems = [];
            let img = "";
    
            fetch(menuJSON)
            .then(this.handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                arrHeaders.push('<ul class="menu-ctn"><li><a href="/"><img alt="" src="/lib/img/home.png" class="menuicon" />HOME</a></li>SRS');

                for(let item, i = 0; item = data[i++];) {
                    let h = item.menugroup;
                    let headerFlag = 'off';
                    if(item.flgSelGroup === 1) headerFlag='on';
                    if(!(h in objHeaders)) {
                        //add header (distinct)
                        objHeaders[h] = 1;
                        arrHeaders.push(`</ul></li><li id="mh_${h}" class="${headerFlag}">${h}<ul id="md_${h}" class="dropdown">`);
                    }
                    //add item
                    let itemFlag = 'off';
                    if(item.flgSelItem === 1) itemFlag='on';
                    if(item.menuItemImg != "") {
                      img = `<img alt="" src="/lib/img/${item.menuItemImg}" class="menuicon" />`;
                    } else {
                      img = `<span class="menuicon">&nbsp;&nbsp;</span>`;
                    }
                    arrHeaders.push(`<li>${img}<a class="${itemFlag}" href="${item.menulink}">${item.menutext}</a></li>`);
                }
                //end menu html
                arrHeaders.push('</li></ul>');
                nav.innerHTML = arrHeaders.join('').replace('SRS</ul>','');        
            })
            .catch(function(error) {
                console.log(error);
            });
        }


    // Filter section
        addKeyListener(key_id) {
            document.querySelectorAll(".btnKey").forEach(item => {
                item.addEventListener("click", event => {
                    toggleElement(key_id);
                    let popupDiv = document.getElementById(key_id);
                    let calcStyle = this.calcPosition({
                        "element": popupDiv,
                        "position": "cursor-offset",
                        "cX" : event.clientX,
                        "cY" : event.clientY,
                        "oY" : 40
                    });
                    popupDiv.style.left = `${calcStyle.left}px`;
                    popupDiv.style.top = `${calcStyle.top}px`;
                });
            });
        }  


    // Results section
        addColumnListeners() {
            document.querySelectorAll(".sortable").forEach(item => {
                item.addEventListener("click", event => {
                    let columnName = item.id.replace("col_","");
                    this.sortResults({
                        "columnName":columnName
                    });
                });
            });
        }
    
        addDrilldownListeners(e) {
            document.querySelectorAll(".btnHyperlink").forEach(item => {
                item.addEventListener("click", event => {
                    let element_id = item.id.replace("btn_","");
                    //http_openDetail(e.element_name, element_id, e.popup_id);
                    this.getDrilldown({ 
                        "element_id": element_id
                    });
                });
            });
        }

        sortResults(e) {
            let id = e.filterField || "filter_sortorder";
            let formId = e.formId || "vistorm";

            try {
                if (document.getElementById(id)) {

                    if(document.getElementById(id).value != e.columnName) {
                        document.getElementById(id).value = e.columnName;
                        document.getElementById(formId).submit();
                    }
                }
            } catch (e) {
                return false;
            }
        }


    // Drilldown methods
        getDrilldown(e) {
            //console.log("getDrilldown", e);
            const url = `/lib/http/${this.drilldown_filename}.asp?sid=${Math.random()}`;
            const params = e.params || `${this.drilldown_fieldname}=${encodeURIComponent(e.element_id)}`;
            let popupDiv = document.getElementById(this.drilldown_id);
            let popupDivKey = document.getElementById(`${this.drilldown_id}Key`);
            let popupDivKeyValues = document.getElementById(`${this.drilldown_id}KeyValues`);
            let callback = this.drilldown_callback;
            let submitcallback = this.drilldown_submitcallback;

            console.log("fetch", url, params);
            let response = fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: params
            })
            .then(this.handleErrors)
            .then(response => response.text())
            .then(function(html) {
                //console.log("html", html);
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                let modal = document.getElementById("divModal");
                if(modal) modal.style.display = "block";
                popupDiv.style.display = "inherit";
                popupDiv.innerHTML = doc.getElementById("popupInnerHtml").innerHTML;
            })
            .then(() => {
                //position and display the drilldown (unless "position" specified otherwise, defaults to center)
                let calcStyle = this.calcPosition({
                    "element": popupDiv,
                    "oY" : -50
                });
                popupDiv.style.left = `${calcStyle.left}px`;
                popupDiv.style.top = `${calcStyle.top}px`;

                if(popupDivKey) {
                    let calcKeyLeft = calcStyle.left + parseInt(popupDiv.clientWidth) + 10;
                    let calcKeyTop = calcStyle.top + parseInt((popupDiv.clientHeight) / 2) - (parseInt(popupDivKey.clientHeight) / 2);
                    popupDivKey.style.display = "block";
                    if(popupDivKey.innerText === "") {
                        if(popupDivKeyValues) {
                            popupDivKey.innerHTML = popupDivKeyValues.innerHTML;
                        }
                    }
                    popupDivKey.style.left = `${calcKeyLeft}px`;
                    popupDivKey.style.top = `${calcKeyTop}px`;
                }
                    
            })
            .then(() => {
                // any post load actions (e.g. solutioning parse of SLA)
                if(typeof submitcallback === "function") {
                    document.getElementById(this.drilldown_submitid).addEventListener("click", submitcallback);
                }
                
                if (typeof callback === "function") {
                    callback();
                }
            })
            .then(() => {
                //apply any updates to the summary screen
                let updatesField = document.getElementById("updateSummary");
                if(updatesField) {
                    let summaryValues = updatesField.value;
                    if(summaryValues !== "") {
                        let summaryValuesArray = summaryValues.split("|");
                        this.updateSummary({
                            "rowid" : `tr_${summaryValuesArray[1]}`,
                            "results": summaryValuesArray
                        });
                    }
                }
                    
            })
            .catch(function(error) {
                console.log(error);
            });

        }


    // Miscellaneous methods
        calcPosition(e) {
            const element = e.element;
            let elementWidth = element.clientWidth;
            let elementHeight = element.clientHeight;
            let elementPosition = e.position || "center";
            let calcLeft, calcTop, calcMarginLeft, calcMarginTop; 
            let offsetY = e.oY || 0;           

            switch (elementPosition) {
                case "center":
                    calcLeft = (screen.width - elementWidth) / 2;
                    calcTop = ((screen.height - elementHeight) / 2) + offsetY;
                    break;
                case "cursor-offset":
                    calcLeft = e.cX - (elementWidth / 2);
                    calcTop = e.cY + offsetY;
                    break;

            }

            let returnStyle = {
                "left": calcLeft,
                "top": calcTop,
                "marginLeft": calcMarginLeft,
                "marginTop": calcMarginTop
            }
            
            return returnStyle;

        }

        findEmployee(e) {
            const url = `/api/FindEmployee.asp?sid=${Math.random()}`;
            let callback = e.callback || false;
            
            let data = new URLSearchParams();
            //mandatory
            data.append("searchtext", e.searchtext);            

            //optional fields
            if(e.filter_excludelist) data.append("filter_excludelist", e.filter_excludelist);
            if(e.filter_region) data.append("filter_region", e.filter_region);
            if(e.filter_masterteam) data.append("filter_masterteam", e.filter_masterteam);
            if(e.filter_capability) data.append("filter_capability", e.filter_capability);
            if(e.filter_subcapability) data.append("filter_subcapability", e.filter_subcapability);
            
            let response = fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: data
            })
            .then(this.handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if(callback) {
                    callback(data);
                }
            })
            .catch(function(error) {
                console.log(error);
            });

        }

        handleErrors(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        styleSelectElements() {
            //iterate select controls and add placeholder class where current value is blank
            var selectList = document.querySelectorAll("select.sel");
            selectList.forEach((s) => {
                if(s.value === "") {
                    s.classList.add("placeholder");
                    s.classList.remove("selected");
                } else {
                    s.classList.remove("placeholder");
                    s.classList.add("selected");
                }

                //add listener to react to changes in selected option
                 s.addEventListener("change", (e) => {
                    if(e.value === "") {
                        s.classList.add("placeholder");
                        s.classList.remove("selected");
                    } else {
                        s.classList.remove("placeholder");
                        s.classList.add("selected");
                    }
                });
         });
    }

    updateSummary(e) {
        const tr = document.getElementById(e.rowid);
        if(tr) {
            const cells = tr.querySelectorAll("td");
            if(cells.length === e.results.length) {
                const btn = document.getElementById(tr.id.replace("tr_", "btn_"));
                btn.value = e.results[0];

                for(let i=1; i < cells.length; i++) {
                    cells[i].innerText = e.results[i];
                }
            }
        }
    }
}
