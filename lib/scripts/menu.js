function createMenu(cp) {
    const menuJSON = `/api/ListMenuItems.asp?cp=${cp}`;
    const nav = document.querySelector('#menu');
    let objHeaders = {};
    let arrHeaders = [];
    let arrItems = [];
    let img = "";
    
    fetch(menuJSON)
    .then((response) => {
        return response.json();
      })
      .then((data) => {
          //start menu html
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
        //console.log(objHeaders);
        nav.innerHTML = arrHeaders.join('').replace('SRS</ul>','');
      });

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
      
      }

    );

    //Ensure any select lists containing a placeholder are styled similar to equivalent input fields
    styleSelect()
      
}

function styleSelect() {
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



