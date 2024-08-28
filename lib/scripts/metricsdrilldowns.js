function createDrilldowns(arrDrilldown, flgEmployee) {
    const parentElement = document.getElementById("drilldown_menu");
    const currentLevel = document.getElementById("drilldown_currentlevel").value;
    //const arrDrilldown = ["Region","SubRegion","Country","CostCenter","Capability","Sub-capability","Employee"];
    if(flgEmployee && currentLevel === "Employee") {
        arrDrilldown.push("CATW");
        arrDrilldown.push("SCH");
    }
    arrDrilldown.filter(d => d!==currentLevel)
        .forEach(d => {
            let e = document.createElement("input");
            e.id = `drilldown_${d}`;
            e.value = `by ${d}`;
            e.className = "btnHyperlink";
            if(d === "CATW" | d === "SCH") {
                e.addEventListener("click", ()=>{consult_employeedrilldown(`${d}`,3)});
            } else {
                e.addEventListener("click", ()=>{metrics_selectDrilldown(`${d}`)});
            }
            
            parentElement.appendChild(e);
        }
    );

    //Calculate height needed
    const h = 28 + (arrDrilldown.length * 16);
    document.getElementById("drilldown_div").style.height = `${h}px`;
}