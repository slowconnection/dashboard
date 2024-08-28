function scheduleOnClick(cell, flgMove) {
    //Identify user/date linked to the clicked cell
    //create pop-up div containing results that match the user/data combo
    //var s = new scheduleCell(cell);
    const d = getCellDate(cell),
        u = getCellUsername(cell),
        n = getCellName(cell),
        sc = document.getElementById("selectedcell"),
        url = "/lib/http/sch_cell.asp?sid=" + Math.random(),
        params = "filter_username=".concat(encodeURIComponent(u), "&filter_date=", encodeURIComponent(d), "&filter_name=", encodeURIComponent(n), "&clicker_id=", encodeURIComponent(cell.id)),
        scheduleClicker = document.getElementById("scheduleClicker"),
        scheduleDetail = document.getElementById("scheduleDetail");

    sc.value = cell.id;
    scheduleClicker.style.display = "";
    scheduleDetail.style.display = "none";
    http_getDetail(url, params, flgMove, "", scheduleClicker.id);
}


function editSchedule(scheduleid, selecteduser, selecteddate, method) {
    //identify which cell is open (so that update/add can easily force refresh of the scheduleClicker div via scheduleOnClick(cell);)
    //var clicker_id = document.getElementById("clicker_id").value;
    //var cell = document.getElementById(clicker_id);
    let scheduleClicker = document.getElementById("scheduleClicker"),
        url = "",
        dev = "", 
        params = "",
        modal = document.getElementById("divModal"),
        scheduleDetail = document.getElementById("scheduleDetail");
    
    //if(selecteduser === "andy") {
    //    dev = "_dev";    
    //}

    modal.style.display = "block";
    scheduleDetail.style.display = "";
    scheduleDetail.style.position = "absolute";
    scheduleDetail.style.top = parseInt(scheduleClicker.style.top) - pageYOffset - 100 + "px";
    scheduleDetail.style.left = parseInt(scheduleClicker.style.left) - 50 + "px";

    //Load either the sch_detail or sch_detail_multiple screen - subject to icon clicked.  Resize the pop-up accordingly
    if (method === "V") {
        //url = "/lib/http/sch_detail.asp?sid=" + Math.random();
        url =  `/lib/http/sch_detail${dev}.asp?sid=${Math.random()}`;
        params = "scheduleid=".concat(encodeURIComponent(scheduleid), "&selecteduser=", encodeURIComponent(selecteduser), "&selecteddate=", encodeURIComponent(selecteddate), "&method=", encodeURIComponent(method));
        scheduleDetail.style.width = "480px";
        scheduleDetail.style.height = "600px";
    } else {
        url = "/lib/http/sch_detail_multiple.asp?sid=" + Math.random();
        params = "scheduleid=".concat(encodeURIComponent(scheduleid), "&selecteduser=", encodeURIComponent(selecteduser), "&selecteddate=", encodeURIComponent(selecteddate), "&method=", encodeURIComponent(method));
        scheduleDetail.style.width = "950px";
        scheduleDetail.style.height = "630px";
    }
    //console.log(params);
    http_getDetail(url, params, 0, "", scheduleDetail.id);
}


function updateSchedule() {
    let doc = document,
        scheduleid = doc.getElementById("scheduleid").value,
        method = doc.getElementById("updateaction").value,
        screen = doc.getElementById("screen").value,
        cv = "scheduleDetail",
        f = "sch_detail.asp",
        btn = document.getElementById("btnScheduleUpdate");

    //disable the button to prevent double-submit
    if(btn) btn.disabled = true;

    if (screen === "m") {
        cv = "scheduleDetailMultiple";
        f = "sch_detail_multiple.asp";
    }

    if (checkValues(cv)) {

        var params = "scheduleid=" + encodeURIComponent(scheduleid) + "&method=" + encodeURIComponent(method);
        //iterate fields
        //var strResult = "";
        let o = [], 
            div = doc.getElementById("divChanges"),
            arrFields = div.getElementsByTagName("input"),
            ix = 0,
            iy = arrFields.length,
            fieldid = "",
            updString = "",
            n = "",
            nv = "",
            v = "";

        for (let ix = arrFields.length - 1; ix >= 0; ix--) {
            try {
                fieldid = arrFields[ix].id;
                //Checkboxes do not have an old_ accompanying field so are missed by the standard logic.  Force inclusion in the SQL if addmode and checked.
                if (method == "A" && fieldid.indexOf("addmode_flg") == 0) {
                    if (doc.getElementById(fieldid).checked) {
                        updString += fieldid + "\n";
                        params += "&" + fieldid + "=" + encodeURIComponent("on");
                    }
                    
                } else {
                    //aside from the addmode flags, only consider fields that have an accompanying old_ field so that comparison old/new can be made.
                    if (fieldid.indexOf("old_") == 0) {
                        o[o.length] = arrFields[ix];
                    }
                }
            } catch (e) {
                console.log("ERROR: " + e.description + "\n" + ix);
            }
        }

        //fields with changes made
        for (let ix = o.length - 1; ix >= 0; ix--) {
            try {
                n = o[ix].id.replace("old_", "");
                //console.log(n,nv,method);
                nv = quoteReplace(doc.getElementById(n).value);
                v = quoteReplace(o[ix].value);
                //when adding the old and new field values will match - so ordinarily would be omitted from the POST (hence the check for viewtype)
                if (n != "scheduleid" && (v != nv || method == "A")) {
                    updString += n + "\n";
                    params += "&" + n + "=" + encodeURIComponent(nv);
                }
            } catch (e) {
                console.log("ERROR: " + e.description + "\nID:" + o[ix].id + "\nN:" + n + "\nNV:" + nv);
            }
        }

        if (!isWhitespace(params)) {
            var url = "/lib/http/" + f + "?sid=" + Math.random();

            //s = "SCHEDULE UPDATED\n" + updString;
            //s = s.replace(/\n/gi, "<br/>");
            http_getDetailCallback(url, params, updateScheduleUI);

        } else {
            if(btn) btn.disabled = false;

            if (doc.getElementById("sqlmessage")) {
                doc.getElementById("sqlmessage").innerHTML = "No changes made";
                
            } else {
                window.alert("No changes made");
            }
        }
    }

}

function updateScheduleUI(xhttp) {
    let doc = document;
    var scheduleDetail = doc.getElementById("scheduleDetail");
    var method = doc.getElementById("updateaction").value;

    scheduleDetail.innerHTML = xhttp.responseText;
    
    if (doc.getElementById("scheduleTransactions")) {
        var st = doc.getElementById("scheduleTransactions").innerHTML;
        processScheduleTransactions(prepareScheduleTransactions(st), method);

        //force refresh of the scheduleCell popup
        var scid = doc.getElementById("selectedcell").value;
        var sc = doc.getElementById(scid);
        scheduleOnClick(sc, 0);

    } else {
        console.log("scheduleTransactions not found");
    }
    //close the scheduleDetail
    var modal = doc.getElementById("divModal");
    modal.style.display = "none";
}


function prepareScheduleTransactions(s) {
    return s.split('|r|').map(e => e.split('|c|'));
}


function processScheduleTransactions(arrSchedule, method) {
    //receives array of scheduleID, username, date, content
    //adds/edits/deletes existing entries accordingly
    //works as an alternative to forcing refresh of the Schedule (reducing client/server overhead)
    let doc = document;
    var asl = arrSchedule.length;
    if (asl === 0) {
        window.location.reload();
    } else {

        if (asl != 0) {
            for (var si = 0; si < asl; si++) {
                var scheduleID = arrSchedule[si][0];
                if (!isWhitespace(scheduleID)) {
                    var s = doc.getElementById(scheduleID);
                    
                    var username = arrSchedule[si][1];
                    var strScheduleDate = arrSchedule[si][2];
                    var scheduleColour = arrSchedule[si][3];
                    var calendarEntry = arrSchedule[si][4];
                    var CustomerName = arrSchedule[si][5];

                    var ce = doc.getElementById(calcCell("", username, strScheduleDate));

                    var flgExists = 0;
                    var flgCellExists = 0;

                    //Does scheduleID exist?
                    if (s) flgExists = 1;

                    //Should scheduleID exist?
                    if (ce) flgCellExists = 1;

                    if (flgExists === 1) {
                        if (flgCellExists === 1) {
                            if (method === "U" || method === "D") {
                                //either delete or update depending upon the recordset.
                                //a delete only has scheduleID set (all else null)
                                if (CustomerName == "" && calendarEntry == "") {
                                    s.parentNode.removeChild(s);
                                } else {
                                    s.innerHTML = calendarEntry;
                                    if (!isWhitespace(scheduleColour)) s.style.backgroundColor = scheduleColour;
                                    ce.appendChild(s);
                                }


                            } else {
                                ce.appendChild(s);
                            }

                        } else {
                            //REMOVE ELEMENT
                            
                            s.parentNode.removeChild(s);
                        }
                    } else {
                        if (flgCellExists == 1) {
                            //CREATE ELEMENT
                            var newspan = document.createElement("span");
                            newspan.id = scheduleID;
                            newspan.className = "scheduleJob";
                            newspan.innerHTML = calendarEntry;
                            if (!isWhitespace(scheduleColour)) newspan.style.backgroundColor = scheduleColour;
                            ce.appendChild(newspan);

                        }
                    }


                }
            }

        }

    }
}



function changeScheduleLink(e) {
    const span = document.getElementById("spanlinkid");
    const label = document.getElementById("scheduleLinkLabel");
    const linkid = document.getElementById("linkid");

    switch (e.value) {
        case "EPM":
            span.style.display = "";
            label.innerHTML = "EPM ID:";
            linkid.style.display = "";
            linkid.value = "";
            break;
        case "WBS":
            span.style.display = "";
            label.innerHTML = "WBS:";
            linkid.style.display = "";
            linkid.value = "";
            break;
        case "OPP":
            span.style.display = "";
            label.innerHTML = "SFDC ID:";
            linkid.style.display = "";
            linkid.value = "";
            break;
        case "PPM":
            span.style.display = "";
            label.innerHTML = "PPMC Position ID:";
            linkid.style.display = "";
            linkid.value = "";
            break;
        case "HPE":
            span.style.display = "none";
            linkid.value = "";
            break;
        case "DXC":
            span.style.display = "none";
            linkid.value = "";
            break;
        case "PUB":
            span.style.display = "none";
            linkid.value = "";
            break;
        default:
            span.style.display = "none";
            linkid.value = "";

    }
}


function checkValues(s) {
    let doc = document;
    var errorstring = "";
    var errMessages = []; //new Array();
    var cntChanges = 0;
    var retval = false;
    

    if (s == "scheduleDetail") {
        var sd = doc.getElementById("scheduledate");
        if (isWhitespace(doc.getElementById("customername").value)) { errMessages[errMessages.length] = '\nCustomer Name'; }
        if (isWhitespace(sd.value)) {
            errMessages[errMessages.length] = '\nDate';
        } else {
            if (!isValidDate(sd.value)) {
                errMessages[errMessages.length] = '\nStart Date must be in  dd/mm/yyyy format';
            }
        }
        if (isWhitespace(doc.getElementById("schedulehoursstr").value)) { errMessages[errMessages.length] = '\nHours'; }

        if (doc.getElementById("AddModeSpan")) {
            //check dates
            var ed = doc.getElementById("addmode_enddate");

            //only pass the visible element
            if (doc.getElementById("selnumday").style.display == "none") { doc.getElementById("addmode_duration").value = ""; }
            if (doc.getElementById("selenddate").style.display == "none") {
                ed.value = "";
            } else {
                if (!isValidDate(ed.value)) {
                    errMessages[errMessages.length] = '\nEnd Date must be in  dd/mm/yyyy format';
                }
            }

        }

    }

    if (s == "scheduleDetailMultiple") {
        var cntSelected = parseInt(doc.getElementById("cntSelected").value);
        if (cntSelected == 0) {
            errMessages[errMessages.length] = '\nNo entries selected';
        } else {
            if (doc.getElementById("updateaction").value != "D") {
                //at least one entry selected.  verify that at least one change has been requested ####################
                var schedulecategorya = doc.getElementById("schedulecategorya");
                var customername = doc.getElementById("customername");
                var schedulelocation = doc.getElementById("schedulelocation");
                var schedulehoursstr = doc.getElementById("schedulehoursstr");
                var currencycode = doc.getElementById("currencycode");
                var schedulerevenue_rate = doc.getElementById("schedulerevenue_rate");
                var schedulecost_rate = doc.getElementById("schedulecost_rate");
                var company_dollar = doc.getElementById("company_dollar");
                var linktype = doc.getElementById("linktype");
                var linkid = doc.getElementById("linkid");
                var spanlinkid = doc.getElementById("spanlinkid");

                if (customername.style.display != "none") {
                    if (customername.value == "") {
                        errMessages[errMessages.length] = '\nCustomer';
                    } else {
                        cntChanges += 1;
                    }
                } else {
                    //prevent any hidden changes
                    customername.value = "";
                }
                if (schedulelocation.style.display != "none") {
                    if (schedulelocation.value == "") { schedulelocation.value = " "; }
                    cntChanges += 1;
                } else {
                    schedulelocation.value = "";
                }
                if (schedulehoursstr.style.display != "none") {
                    if (schedulehoursstr.value == "") {
                        errMessages[errMessages.length] = '\nHours';
                    } else {
                        cntChanges += 1;
                    }
                } else {
                    schedulehoursstr.value = "";
                }
                if (schedulerevenue_rate.style.display != "none") {
                    if (schedulerevenue_rate.value == "") {
                        errMessages[errMessages.length] = '\nRevenue/Hour';
                    } else {
                        cntChanges += 1;
                    }
                } else {
                    schedulerevenue_rate.value = "";
                }
                if (schedulecost_rate.style.display != "none") {
                    if (schedulecost_rate.value == "") {
                        errMessages[errMessages.length] = '\nRelief/Hour';
                    } else {
                        cntChanges += 1;
                    }
                } else {
                    schedulecost_rate.value = "";
                }
                if (linktype.value != "") {
                    if (spanlinkid.style.display != "none") {
                        if (linkid.value != "") {
                            //ID value supplied
                            cntChanges += 1;
                        } else {
                            errMessages[errMessages.length] = "\nLink (" + linktype.value + ") ID";
                        }
                    } else {
                        linkid.value = " ";
                        //ID field not visible therefore none required
                        cntChanges += 1;
                    }
                }

                //dropdown lists
                if (schedulecategorya.value != "") { cntChanges += 1; }
                if (currencycode.value != "") { cntChanges += 1; }
                if (company_dollar.value != "") { cntChanges += 1; }

                if (cntChanges == 0) {
                    errMessages[errMessages.length] = '\nNo changes supplied';
                }
            }

        }
    }

    retval = true;
    for (var i = 0; i < errMessages.length; i++) {
        retval = false;
        errorstring += errMessages[i] + '\n';
    }

    if (!retval) {
        window.alert("The following fields must be completed:\n\n" + errorstring);
        return false;
    } else {
        if (s == "scheduleDetailMultiple") {
            if (confirm("Are you sure you want to update/delete the selected entries?")) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;

        }
    }
}


function deleteSchedule(scheduleid, cell) {
    if (confirm("Delete this task from the Schedule?")) {
        try {
            //HTTP delete
            var xmlHttp = GetXmlHttpObject();
            if (xmlHttp == null) {
                window.alert("Browser does not support HTTP request");
                return;
            }

            var url = "/lib/http/sch_deleteentry.asp?s=" + scheduleid;

            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {

                        var result = xmlHttp.responseText;
                        if (!isWhitespace(result)) {
                            var resultarr = result.split("|||");
                            if (resultarr[0] == "ERROR") {
                                window.alert(resultarr[1]);

                            } else {
                                //remove span from schedule
                                var span = document.getElementById(scheduleid);
                                span.parentNode.removeChild(span);

                                scheduleOnClick(cell, 0);

                            }
                        }
                    }
                }
            };

            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);

        } catch (e) {
            window.alert(e.message);
        }

    }
}


function navSelectDate(datefieldid, datevalue, formid) {
    let doc = document;
    if (doc.getElementById(datefieldid)) {
        doc.getElementById(datefieldid).value = datevalue;
        doc.getElementById(formid).submit();
    }
}


function toggleElements(showid, hideid, blankid) {
    let doc = document;
    if (doc.getElementById(showid) && doc.getElementById(hideid)) {
        doc.getElementById(showid).style.display = "";
        doc.getElementById(hideid).style.display = "none";
        doc.getElementById(blankid).value = "";
    }
}


function chkSelect(chk) {
    let doc = document
        status = chk.checked,
        changed = 0,
        cnt = parseInt(doc.getElementById("cntSelected").value),
        trid = "",
        existingclass = "",
        newclass = "",
        elementid = "";

    //multiple 
    if (chk.id == "chkALL" || chk.id.indexOf("chkMonth") == 0) {
        if (chk.id == "chkALL") {
            elementid = "tblScheduleList";
        } else {
            elementid = chk.id.replace("chkMonth", "tbMonth");
        }

        let t = doc.getElementById(elementid),
            arrinput = t.getElementsByTagName("input");

        for (let i = arrinput.length - 1; i >= 0; i--) {
            if (arrinput[i].id != chk.id) {
                if (arrinput[i].checked != status) {
                    arrinput[i].checked = status;
                    if (arrinput[i].id.indexOf("chkItem") == 0) {
                        changed++;
                        trid = arrinput[i].id.replace("chkItem", "tr");
                        existingclass = doc.getElementById(trid).className;
                        newclass = existingclass.replace("SEL", "");
                        if (status) { newclass = newclass + "SEL"; }
                        doc.getElementById(trid).className = newclass;
                    }

                }
            }

        }

        if (status) {
            cnt += changed;
        } else {
            cnt -= changed;
        }
        //Single
    } else {
        trid = chk.id.replace("chkItem", "tr");
        existingclass = doc.getElementById(trid).className;
        newclass = existingclass.replace("SEL", "");


        if (chk.checked) {
            cnt++;
            newclass = newclass + "SEL";
        } else {
            cnt--;
        }

        doc.getElementById(trid).className = newclass;
    }
    setChangeList();
    doc.getElementById("cntSelected").value = cnt;
}


function setChangeList() {
    let t = document.getElementById("tblScheduleList"),
        bulklist = document.getElementById("bulklist"),
        arrinput = t.getElementsByTagName("input"),
        id = "";

    bulklist.value = "";
    for (let i = arrinput.length - 1; i >= 0; i--) {
        if (arrinput[i].id.indexOf("chkItem") == 0) {
            id = arrinput[i].id.replace("chkItem", "");
            if (arrinput[i].checked) {
                bulklist.value += id + ",";
            }
        }
    }
}


function setMethod(method) {
    if (document.getElementById("updateaction")) {
        document.getElementById("updateaction").value = method;

        updateSchedule();
    }
}

//Schedule Cell functions - ideally these would be in a class but IE doesn't support this feature
    function getCellUsername(cell) {
        const x = cell.id.split("_");
        const uid = "td_" + x[1] + "_username";
        return document.getElementById(uid).innerHTML;
    }

    function getCellName(cell) {
        const x = cell.id.split("_");
        const uid = "td_" + x[1] + "_0";
        return document.getElementById(uid).innerHTML;
    }

    function getCellDate(cell) {
        let x = cell.id.split("_");
        let daystoadd = parseInt(x[2]),
            d = document.getElementById("startdate").value.split("/");

        //get selected date based upon (a) searched date and (b) selected column
        let myDate = new Date(Date.UTC(d[2], d[1] - 1, d[0]));
        myDate.setDate(myDate.getDate() + daystoadd -1);


        //return myDate.toISOString().slice(0, 10); //doesn't work with IE in compatibility view.  
        return formatDate(myDate);
    }

    function calcCell(usercell, username, date) {
        //usercell only provided if known - saves having to search again
        try {
            var tblSchedule = document.getElementById("tblSchedule");
            if (usercell == "") {
                var userspans = tblSchedule.getElementsByTagName('span');
                for (let i = userspans.length - 1; i >= 0; i--) {
                    if (userspans[i].id.indexOf("_username") != 0) {
                        if (userspans[i].innerHTML == username) {
                            usercell = userspans[i].id;
                        }
                    }
                }

            }

            if (date != "") {
                var one_day = 1000 * 60 * 60 * 24;
                var startdate = convDate(document.getElementById("startdate").value);
                var seldate = convDate(date);

                var col = ((seldate - startdate) / one_day) + 1;
                if (col >= 0) {
                    var x = usercell.split("_");
                    x[2] = col;
                    usercell = document.getElementById(x.join("_"));
                    if (usercell) {
                        usercell = usercell.id;
                    } else {
                        usercell = "NO";
                    }

                } else {
                    usercell = "NO";
                }


            } else {
                usercell = "NO";
            }
        } catch (e) {
            usercell = "NO";
        }
        return usercell;
    }


    


