// Admin/Users
function HTTP_getUserDetail(username, divName, filegroup) {
    const url = `/lib/http/${filegroup}_getUserDetail.asp?sid=${Math.random()}`;
    let params = "u=" + encodeURIComponent(username);
    let movewindow = 2;
    divName = divName || "popupUser";
    if (document.getElementById(divName)) {
        //document.getElementById(divName).style.width = "1000px";
        if (document.getElementById(divName).style.display != "none") {
            movewindow = 0;
        }
    }
    http_getDetail(url, params, movewindow, "", divName);
}

function HTTP_postUserDetail(username, divName, filegroup) {
    if(validateAdminUsers()) {
        try {
            //blank old fields for fromperiod and toperiod to force inclusion
            document.getElementById("old_fromperiod").value = "";
            document.getElementById("old_toperiod").value = "";
        }
        catch (e) {
            alert(e.Message);
        }

        //ad-hoc handling of comments field
        if (document.getElementById("user_comments")) {
            const uc = document.getElementById("user_comments");
            if (uc.style.display != "none" && uc.value == "") {
                uc.value = "(blank)";
            }
        }

        //let params = "u=" + encodeURIComponent(username);
        //iterate fields
        let strResult = "";
        let o = new Array();
        const div = document.getElementById("divChanges");
        const arrFields = div.getElementsByTagName("input");
        let ix = 0;
        for(ix = 0; ix < arrFields.length; ix++) {
            try {
                if (arrFields[ix].id.indexOf("old_") == 0) {
                    o[o.length] = arrFields[ix];
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\n" + ix);
            }
        }
        //fields with changes made
        let params = "";
        let updString = "";
        for (let ix = 0; ix < o.length; ix++) {
            try {
                const n = o[ix].id.replace("old_", "");
                const nv = quoteReplace(document.getElementById(n).value);
                const v = quoteReplace(o[ix].value);
                if (v != nv) {
                    updString += n + "\n";
                    params += "&" + n + "=" + encodeURIComponent(nv);
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\nID:" + o[ix].id + "\nN:" + n + "\nNV:" + nv);
            }
        }


        if (!isWhitespace(params)) {
            var url = "/lib/http/" + filegroup + "_getUserDetail.asp?sid=" + Math.random();
            params = "u=" + username + params;

            s = "USER UPDATED\n" + updString;
            s = s.replace(/\n/gi, "<br/>");
            
            http_getDetail(url, params, 0, s, divName);

        } else {
            if (document.getElementById("sqlmessage")) {
                document.getElementById("sqlmessage").innerHTML = "No changes made";
            } else {
                alert("No changes made");
            }
        }
    }
}

function validateAdminUsers() {
    var errormsg = "";
    var retval = true;

    var dtFrom = document.getElementById("fromperiod").value;
    var dtTo = document.getElementById("toperiod").value;

    if (dtFrom > dtTo) {
        errormsg = errormsg + "\n* The TO period must be after the FROM period!";
    }

    if (errormsg.length != 0) {
        errormsg = "UPDATE cannot be done because " + errormsg;
    }

    if (errormsg.length != 0) {
        retval = false;
        alert(errormsg);
    }

    return retval;
}

function user_getEmployeeDetails(employeeid, divName) {
    //need to resize the div to fit the Employee details
    document.getElementById(divName).style.width = "400px";
    HTTP_getEmployeeDetail(employeeid, divName);
}

// Admin/Employee
function findemployee_onkeyup(id) {
    var div = id.id + '_results';
    if (!isWhitespace(id.value)) {
        showElement(div);
        var url = "/lib/http/adm_findemployee.asp?sid=" + Math.random();
        var params = "s=" + encodeURIComponent(id.value);
        http_FindValue(url, params, div);

    } else {
        hideElement(div);
    }
}

function findemployee_selected(username, fullname) {
    try {
        document.getElementById("managerusername").value = username;
        document.getElementById("disp_managername").innerHTML = fullname;
        hideElement("tb_newmgr");
    } catch (e) {
        alert(e.Message);
    }  

}

function findcostcenter_onkeyup(id) {
    var div = id.id + '_results';
    if (!isWhitespace(id.value)) {
        showElement(div);
        var url = "/lib/http/adm_findcostcenter.asp?sid=" + Math.random();
        var params = "s=" + encodeURIComponent(id.value);
        http_FindValue(url, params, div);

    } else {
        hideElement(div);
    }
}

function findcostcenter_selected(costcenter) {
    try {
        document.getElementById("cost_center").value = costcenter;
        document.getElementById("disp_cost_center_text").innerHTML = costcenter;
        hideElement("tb_newcc");
    } catch (e) {
        alert(e.Message);
    }  

}

function HTTP_getEmployeeDetail(employeeid, divName) {
    var url = "/lib/http/holiday_getEmployeeDetail.asp?sid=" + Math.random();
    var params = "filter_employeeid=" + encodeURIComponent(employeeid);
    var popupWidth = "820px";
    if (employeeid != "") {
        popupWidth = "400px";
    }
    var movewindow = 2;
    divName = divName || "popupUser";
    if (document.getElementById(divName)) {
        document.getElementById(divName).style.width = popupWidth;
        if (document.getElementById(divName).style.display != "none") {
            movewindow = 0;

        }
    }
    http_getDetail(url, params, movewindow, "", divName);
}

function HTTP_postEmployeeDetail(employeeid, divName) {
    if (validateEmployeeDetails()) {

        //ad-hoc handling of HPID and leaver fields
        if (document.getElementById("HPID")) {
            var hpid = document.getElementById("HPID");
            if (hpid.value == "") { hpid.value = "(blank)"; }
        }

        if (document.getElementById("leavedate")) {
            var leavedate = document.getElementById("leavedate");
            var oldleavedate = document.getElementById("old_leavedate");
            if (leavedate.value == "" && oldleavedate != "") { leavedate.value = "(blank)"; }
        }

        //var params = "filter_employeeid=" + encodeURIComponent(employeeid);
        //iterate fields
        var strResult = "";
        var o = new Array();
        var div = document.getElementById("divChanges");
        var arrFields = div.getElementsByTagName("input");
        var ix = 0;
        for (ix = 0; ix < arrFields.length; ix++) {
            try {
                if (arrFields[ix].id.indexOf("old_") == 0) {
                    o[o.length] = arrFields[ix];
                    /*strResult+= arrFields[ix].id + "=" + arrFields[ix].value + "\n";*/
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\n" + ix);
            }
        }
        //fields with changes made
        var params = "";
        var updString = "";
        for (ix = 0; ix < o.length; ix++) {
            try {
                var n = o[ix].id.replace("old_", "");
                var nv = quoteReplace(document.getElementById(n).value);
                var v = quoteReplace(o[ix].value);
                if (v != nv || employeeid == "") {
                    updString += n + "\n";
                    params += "&" + n + "=" + encodeURIComponent(nv);
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\nID:" + o[ix].id + "\nN:" + n + "\nNV:" + nv);
            }
        }

        if (!isWhitespace(params)) {

            var url = "/lib/http/holiday_getEmployeeDetail.asp?sid=" + Math.random();

            if (employeeid == "") {
                params = "method=A" + params;
                document.getElementById(divName).style.width = "400px";
            } else {
                params = "method=U&filter_employeeid=" + encodeURIComponent(employeeid) + params;
            }
            //alert(params);
            s = "EMPLOYEE UPDATED\n" + updString;
            s = s.replace(/\n/gi, "<br/>");

            http_getDetail(url, params, 0, s, divName);

        } else {
            if (document.getElementById("sqlmessage")) {
                document.getElementById("sqlmessage").innerHTML = "No changes made";
            } else {
                alert("No changes made");
            }
        }
    }
}

function validateEmployeeDetails() {
    var errormsg = "";
    var method = "UPDATE";
    var retval = true;

    //required fields
    var employeeid = document.getElementById("filter_employeeid").value;

    if (isWhitespace(document.getElementById("firstname").value)) { errormsg = errormsg + "\n* First Name"; }
    if (isWhitespace(document.getElementById("lastname").value)) { errormsg = errormsg + "\n* Last Name"; }
    if (!isValidEmail(document.getElementById("emailaddress").value)) { errormsg = errormsg + "\n* Email"; }
    if (isWhitespace(document.getElementById("joindate").value)) { errormsg = errormsg + "\n* ESS Start"; }
    if (isWhitespace(document.getElementById("division").value)) { errormsg = errormsg + "\n* Division"; }
    if (isWhitespace(document.getElementById("legacy_company").value)) { errormsg = errormsg + "\n* Legacy Company"; }
    //if (isWhitespace(document.getElementById("flgholidays").value)) { errormsg = errormsg + "\n* Holidays"; }
    if (errormsg.length != 0) { errormsg = errormsg + "\n"; }

    //Addmode checks
    if (employeeid == "") {
        method = "ADD";
        if (isWhitespace(document.getElementById("country").value)) { errormsg = errormsg + "\n* Country"; }
        if (isWhitespace(document.getElementById("hours").value)) { errormsg = errormsg + "\n* Work Hours"; }
        if (isWhitespace(document.getElementById("workingdays").value)) { errormsg = errormsg + "\n* Work Days"; }
        if (isWhitespace(document.getElementById("managerusername").value)) { errormsg = errormsg + "\n* Manager"; }
    }

    if (errormsg.length != 0) {
        errormsg = method + " cannot be done because of empty;" + errormsg;
    }

    if (errormsg.length != 0) {
        retval = false;
        alert(errormsg);
    }

    return retval;
}

function employee_getUserDetails(username, divName, filegroup) {
    //need to resize the div to fit the User details
    document.getElementById(divName).style.width = "1200px";
    HTTP_getUserDetail(username, divName, filegroup);
}

// Admin/Targets
function HTTP_getTargetDetail(username, translateid, divName) {
    var url = "/lib/http/targets_getUserDetail.asp?sid=" + Math.random();
    var params = "filter_username=" + encodeURIComponent(username);
    params += "&filter_translateid=" + encodeURIComponent(translateid);
    //alert(params);
    var movewindow = 2;
    divName = divName || "popupUser";
    if (document.getElementById(divName)) {
        if (document.getElementById(divName).style.display != "none") {
            movewindow = 0;
        }
    }
    http_getDetail(url, params, movewindow, "", divName);
}

function validateAdminTargets() {
    var errormsg = "";
    var retval = true;

    var dtFrom = document.getElementById("fromperiod").value;
    var dtTo = document.getElementById("toperiod").value;

    if (dtFrom > dtTo) {
        errormsg = errormsg + "\n* The TO period must be after the FROM period!";
    }

    if (errormsg.length != 0) {
        errormsg = "UPDATE cannot be done because " + errormsg;
    }

    if (errormsg.length != 0) {
        retval = false;
        alert(errormsg);
    }

    return retval;
}

function HTTP_postTargetDetail(username, translateid, divName) {
    if (validateAdminTargets()) {

        //blank old fields for fromperiod and toperiod to force inclusion
        try {
            document.getElementById("old_fromperiod").value = "";
            document.getElementById("old_toperiod").value = "";
        }
        catch (e) {
            alert(e.Message)
        }

        var params = "filter_username=" + encodeURIComponent(username);
        params += "&filter_translateid=" + encodeURIComponent(translateid);
        //iterate fields
        var strResult = "";
        var o = new Array();
        var div = document.getElementById("divChanges");
        var arrFields = div.getElementsByTagName("input");
        var ix = 0;
        for (ix = 0; ix < arrFields.length; ix++) {
            try {
                if (arrFields[ix].id.indexOf("old_") == 0) {
                    o[o.length] = arrFields[ix];
                    /*strResult+= arrFields[ix].id + "=" + arrFields[ix].value + "\n";*/
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\n" + ix);
            }
        }
        //fields with changes made
        var params = "";
        var updString = "";
        for (ix = 0; ix < o.length; ix++) {
            try {
                var n = o[ix].id.replace("old_", "");
                var nv = quoteReplace(document.getElementById(n).value);
                var v = quoteReplace(o[ix].value);
                if (v != nv) {
                    updString += n + "\n";
                    params += "&" + n + "=" + encodeURIComponent(nv);
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\nID:" + o[ix].id + "\nN:" + n + "\nNV:" + nv);
            }
        }

        if (!isWhitespace(params)) {
            var url = "/lib/http/TARGETS_getUserDetail.asp?sid=" + Math.random();
            params = "filter_username=" + encodeURIComponent(username) + "&filter_translateid=" + encodeURIComponent(translateid) + params;

            s = "USER UPDATED\n" + updString;
            s = s.replace(/\n/gi, "<br/>");

            http_getDetail(url, params, 0, s, divName);

        } else {
            if (document.getElementById("sqlmessage")) {
                document.getElementById("sqlmessage").innerHTML = "No changes made";
            } else {
                alert("No changes made");
            }
        }
    }
}



//Virtual Teams
function HTTP_getVirtualTeamDetail(virtualteamid, divName) {
    var url = "/lib/http/vt_getTeamDetail.asp?sid=" + Math.random();
    var params = "filter_virtualteamid=" + encodeURIComponent(virtualteamid);
    var movewindow = 2;
    divName = divName || "popupDetail";
    if (document.getElementById(divName)) {
        //document.getElementById(divName).style.width = popupWidth;
        if (document.getElementById(divName).style.display != "none") {
            movewindow = 0;

        }
    }
    http_getDetail(url, params, movewindow, "", divName);
}


//Combined.  move everything to this model to eradicate need for individual functions that serve the same purpose
    function http_openDetail(entity, id, divName) {
        var url = `/lib/http/${entity}.asp?sid=${Math.random()}`;
        var params = "";
        if(entity=="solutioning") {
            params = `opportunityid=${encodeURIComponent(id)}`;
        } else {
            params = `${entity}_id=${encodeURIComponent(id)}`;
        }
        var movewindow = 2;
        divName = divName || "popupDetail";
        if (document.getElementById(divName)) {
            if (document.getElementById(divName).style.display != "none") {
                movewindow = 0;
            }
        }
        http_getDetail(url, params, movewindow, "", divName);
    }

    function http_postDetail(entity, divName) {
        var reqfields = "",
            params = "",
            divchanges = [],
            arrfields = [],
            cntfields = 0,
            arrrequired = [],
            cntrequired = 0,
            o = [],
            cnto = 0,
            ix = 0,
            strresult = "",
            updstring = "",
            n = "",
            nv = "",
            v = "",
            a = [];

        divName = divName || "popupDetail";
        reqfields += checkRequiredFields("divChanges");

        //use className = "tf_required" on any child field that must have value.  Expectation is that the entity will have id in the format entity_id and that ~n will delineate the row numbers.
        arrrequired = document.getElementsByClassName("inputrequired");
        var cntrequired = arrrequired.length;
        for (ix = 0; ix < cntrequired; ix++) {
            a = arrrequired[ix].id.replace("sql~", "").replace("_id", "").split("~");
            reqfields = reqfields.concat("* ", a[0].toUpperCase(), " #", a[1], "\n");
        }

        //iterate all fields
        divchanges = document.getElementById("divChanges");
        arrfields = divchanges.getElementsByTagName("input");
        cntfields = arrfields.length;
        for (ix = 0; ix < cntfields; ix++) {
            try {
                if (arrfields[ix].id.indexOf("old_") == 0) {
                    n = arrfields[ix].id.replace("old_", "");
                    nv = quoteReplace(document.getElementById(n).value);
                    updstring = updstring.concat(n, "\n");
                    params = params.concat("&", n, "=", encodeURIComponent(nv));
                }
            } catch (e) {
                alert("ERROR: " + e.description + "\n" + ix);
            }
        }

        //HTTP POST
        if (!isWhitespace(reqfields)) {
            alert("Cannot update until the following fields have value\n" + reqfields);
        } else {

            if (!isWhitespace(params)) {
                params = "method=U".concat(params);
                url = "/lib/http/".concat(entity, ".asp?sid=", Math.random());
                s = entity.toUpperCase().concat(" UPDATED");
                s = s.replace(/\n/gi, "<br/>");

                //Use Synchronous request to enable the update_summary to fire after results returned.  ***THIS NOW NEEDS TO BE WRITTEN USING CALLBACK.  SYNC DEPRECATED***
                http_getDetailSync(url, params, 0, s, divName);
                http_updateSummary(entity, divName);
                //http_getDetailCallback(url, params, http_callback);


            } else {
                if (document.getElementById("sqlmessage")) {
                    document.getElementById("sqlmessage").innerHTML = "No changes made";
                } else {
                    alert("No changes made");
                }
            }

        }

    }

    function http_callback(xhr, entity, divName) {
        var popup = document.getElementById(divName);
        popup.innerHTML = xhr.responseText;
        http_updateSummary(entity, divName);
    }

    function http_updateSummary(entity, divName) {
        //div should contain the XMLHTTP response.  Within this should be a field containing values that should be used to update tblResults in the summary screen.
        var srcid = "update_summary", tgtid = "tblResults", a = [], cnta = 0, trid = "", flg = false;
        divName = divName || "popupDetail";

        if (document.getElementById(srcid)) {
            try {
                var src = document.getElementById(srcid);
                var tgt = document.getElementById(tgtid);
                
                if (src.value == "") {
                    cnta = 0;
                } else {
                    a = src.value.split("||");
                    cnta = a.length;
                }

                if (cnta > 0) {
                    trid = "tr_".concat(a[0]);

                    var r = 0;
                    while (row = tgt.rows[r++]) {
                        if (row.id == trid) {
                            var c = 1;
                            flg = true;
                            while (cell = row.cells[c++]) {
                                cell.innerHTML = a[c - 1];
                            }
                        }
                    }

                    if (!flg) {
                        var tr = tgt.insertRow(2), td = tr.insertCell(0);
                        tr.className = "NewRow";
                        tr.id = trid;
                        var newlink = document.createElement("a");
                        newlink.onclick = function () {
                            HTTP_openDetail(entity, a[0], divName);
                        }
                        //newlink.setAttribute("href", "/lib/common/jsrequired.htm");
                        newlink.innerHTML = "EDIT";
                        td.appendChild(newlink);
                        for (ix = 1; ix < cnta; ix++) {
                            td = tr.insertCell(ix);
                            td.innerHTML = a[ix];
                        }
                    }

                }

            } catch (e) {
                alert(e.message);
            }
        }
    }

    function http_postAction(entity, entityid, usernameid, action) {
        //expectation is that the final column has the button
        //if (confirm(action + " employee?")) {
        try {
            //HTTP delete
            xmlHttp = GetXmlHttpObject()
            if (xmlHttp == null) {
                alert("Browser does not support HTTP request");
                return
            }

            var url = `/lib/http/${entity}.asp?sid=${Math.random()}`;
            var params = "eid=" + encodeURIComponent(entityid) + "&uid=" + encodeURIComponent(usernameid) + "&action=" + encodeURIComponent(action);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {

                        result = xmlHttp.responseText;
                        if (!isWhitespace(result)) {
                            var resultarr = result.split("||");
                            if (resultarr[0] == "ERROR") {
                                alert(resultarr[1]);

                            } else {

                                //update the summary screen
                                var trid = "tr_" + usernameid;
                                var tr = document.getElementById(trid);
                                for (var j = 0, col; col = tr.cells[j]; j++) {
                                    if (resultarr[j] != "{}") {
                                        if (resultarr[j].indexOf("BTN:") != -1) {
                                            col.innerHTML = "";
                                            var a = resultarr[j].replace("BTN:", "");
                                            var newlink = document.createElement("a");
                                            newlink.href = "/lib/common/jsrequired.htm";
                                            //newlink.className = "";
                                            newlink.onclick = function () {
                                                http_postAction(entity, entityid, usernameid, a);
                                                return false;
                                            }
                                            newlink.innerHTML = a;
                                            col.appendChild(newlink);
                                        } else {
                                            col.innerHTML = resultarr[j];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //xmlHttp.open("GET", url, true);
            //xmlHttp.send(null);
            xmlHttp.open("POST", url, false);
            xmlHttp.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded; charset=UTF-8"
            );
            xmlHttp.send(params);

        } catch (e) {
            alert(e.message);
        }

        //}

    }

function cc_drilldown(id) {
    var url = "/lib/http/cc_drilldown.asp?sid=" + Math.random();
    var params = "filter_ccid=".concat(encodeURIComponent(id));
    http_getDetail(url, params, 2, 2, "popupDrilldown");
}