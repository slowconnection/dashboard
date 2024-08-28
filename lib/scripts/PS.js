//############################################################   METRICS   ###################################################################################
function metrics_showDrilldown(currentlevel, selectedvalue, filter_uid) {
    var d = document.getElementById("drilldown_div");
    var ds = document.getElementById("drilldown_selectedvalue");
    var dh = document.getElementById("drilldown_header");
    var uid = document.getElementById("filter_uid");
    uid.value = filter_uid;
    ds.value = selectedvalue;
    dh.innerHTML = selectedvalue;
    d.style.display = "";
    AssignPosition(d);

}

function blanker(id) {
    try {
        if (document.getElementById(id)) { document.getElementById(id).value = ""; }

        var uiid = id + "_ui";
        //multi-select controls use a hidden field and rely on a separate UI control to display selections
        if (document.getElementById(uiid)) { document.getElementById(uiid).value = ""; }

    } catch (e) {
        alert(e);
    }
}

function setter(id, value) {
    try {
        if (document.getElementById(id)) { 
            document.getElementById(id).value = value; 
        }        

        //multi-select controls use a hidden field and rely on a separate UI control to display selections
        const uiid = id + "_ui";        
        if (document.getElementById(uiid)) {document.getElementById(uiid).value = value; }   
     
        

    } catch (e) {
        alert(e);
    }
}

function metrics_selectDrilldown(selectedlevel) {
    var currentlevel = document.getElementById("drilldown_currentlevel").value;
    var selectedvalue = document.getElementById("drilldown_selectedvalue").value;
    document.getElementById("drilldown_div").style.display = "none";

    switch (selectedlevel) {
        case "Region":
            selectedvalue = "";
            blanker("filter_region");
            blanker("filter_subregion");
            blanker("filter_country");
            blanker("filter_costcenter")
            blanker("filter_capability")
            blanker("filter_subcapability")
            blanker("filter_virtualteam")
            blanker("filter_names")
            break;
        case "SubRegion":
            //if (currentlevel == "Country" || currentlevel == "Capability" || currentlevel == "Team" || currentlevel == "Employee") { selectedvalue = ""; }
            if (currentlevel == "Country") { selectedvalue = ""; }
            blanker("filter_subregion");
            blanker("filter_country");
            blanker("filter_costcenter")
            blanker("filter_managementlevel");
            blanker("filter_capability")
            blanker("filter_subcapability")
            blanker("filter_virtualteam")
            blanker("filter_names")
            break;
        case "Country":
            //if (currentlevel == "Capability" || currentlevel == "Team" || currentlevel == "Employee") { selectedvalue = ""; }
            blanker("filter_country");
            blanker("filter_costcenter")
            blanker("filter_managementlevel");
            blanker("filter_capability")
            blanker("filter_subcapability")
            blanker("filter_virtualteam")
            blanker("filter_names")
            break;
        case "Capability":
            if (currentlevel == "Capability" || currentlevel == "Team" || currentlevel == "Employee") { selectedvalue = ""; }
            blanker("filter_capability");
            blanker("filter_subcapability");
            blanker("filter_costcenter")
            blanker("filter_managementlevel");
            blanker("filter_virtualteam")
            blanker("filter_names")
            break;
        case "CostCenter":
            //if (currentlevel == "Capability" || currentlevel == "Team" || currentlevel == "Employee") { selectedvalue = ""; }
            blanker("filter_costcenter");
            blanker("filter_virtualteam")
            blanker("filter_names")
            break;
        case "Team":
            if (currentlevel == "Team" || currentlevel == "Employee") { selectedvalue = ""; }
            blanker("filter_subcapability");
            blanker("filter_virtualteam")
            blanker("filter_names")
            break;
        case "Level":
            //if (currentlevel == "Capability" || currentlevel == "Team" || currentlevel == "Employee") { selectedvalue = ""; }
            blanker("filter_managementlevel");
            break;
    }

    switch (currentlevel) {
        case "Region":
            setter("filter_region", selectedvalue);
            break;
        case "SubRegion":
            setter("filter_subregion", selectedvalue);
            break;
        case "Country":
            setter("filter_country", selectedvalue);
            break;
        case "Capability":
            setter("filter_capability", selectedvalue);
            break;
        case "Sub-capability":
            setter("filter_subcapability", selectedvalue);
            break;
        case "Team":
            setter("filter_subcapability", selectedvalue);
            break;
        case "CostCenter":
            setter("filter_costcenter", selectedvalue);
            break;
        case "Level":
            setter("filter_managementlevel", selectedvalue);
            break;
    }

    document.getElementById("filter_reportlevel").value = selectedlevel;
    document.getElementById("vistorm").submit();
    

}

function consult_employeedrilldown(src, movewindow) {
    var employee_name = document.getElementById("drilldown_selectedvalue").value;
    var filter_uid = document.getElementById("filter_uid").value;
    var filter_sl_year = document.getElementById("filter_sl_year").value;
    var filter_sl_half = document.getElementById("filter_sl_half").value;
    var filter_sl_quarter = document.getElementById("filter_sl_quarter").value;
    var filter_sl_period = document.getElementById("filter_sl_period").value;
    var filter_reportType = "DXC";
    var url = "";
    if (src == "CATW") {
        url = "/lib/http/consult_employeedrilldown_catw.asp?sid=" + Math.random();
    } else {
        url = "/lib/http/consult_employeedrilldown_sch.asp?sid=" + Math.random();
    }
    var params = "filter_uid=" + encodeURIComponent(filter_uid);
    if (!isWhitespace(employee_name)) { params += "&employee_name=" + encodeURIComponent(employee_name); }
    if (!isWhitespace(filter_sl_year)) { params += "&filter_sl_year=" + encodeURIComponent(filter_sl_year); }
    if (!isWhitespace(filter_sl_half)) { params += "&filter_sl_half=" + encodeURIComponent(filter_sl_half); }
    if (!isWhitespace(filter_sl_quarter)) { params += "&filter_sl_quarter=" + encodeURIComponent(filter_sl_quarter); }
    if (!isWhitespace(filter_sl_period)) { params += "&filter_sl_period=" + encodeURIComponent(filter_sl_period); }
    if (!isWhitespace(filter_reportType)) { params += "&filter_reportType=" + encodeURIComponent(filter_reportType); }

    http_getDetail(url, params, movewindow, 1, "popupDetail");

    document.getElementById("drilldown_div").style.display = "none";
}

function ltm_employeedrilldown(div, username_id, mth) {
    var url = "/lib/http/ltm_employeedrilldown.asp?sid=" + Math.random();
    var params = "username_id=".concat(encodeURIComponent(username_id), "&mth=", encodeURIComponent(mth));
    http_getDetail(url, params, 1, 2, div);
}