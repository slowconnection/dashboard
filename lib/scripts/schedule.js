function scheduleOnClick(cell) {
	var method = "";
    var tasksCount = "0";
    var flgCanUpdate = document.getElementById("flgCanUpdate").value;
    var strClassname = "";
        
    //get selected username
        var x = cell.id.split("_");
        x[2]="0";
        var usernameId = x.join("_");
        var username = document.getElementById(usernameId);

        //Build "pop up" table
        var tblScheduleTasks = "<div class='popupCaption' onmousedown='javascript:dragStart(event,\"ScheduleClickerDiv\");'>" + username.innerHTML + "     " + calcScheduleDate(cell) + "<img alt='Close' src='/lib/img/close-icon-32.png' onclick='javascript:toggleElement(\"ScheduleClickerDiv\");' /></div>";
        tblScheduleTasks += "<table class='schList'>";
        if (flgCanUpdate == 1) {
            tblScheduleTasks += "<thead><tr style='height:2px'><td style='width:66px'></td><td></td><td style='width:34px'></td></tr></thead>";
        }
   
        tblScheduleTasks += "<tbody>";
        if (flgCanUpdate == 1) {
            tblScheduleTasks += "<tr><td><img src='/lib/img/add-icon-32.png' onclick='javascript:openScheduleDetail(\"\", \"" + cell.id + "\",0);'></td><td colspan='2'>ADD</td></tr>";
        }
    
	if (!cell.childNodes || cell.childNodes.length == 0) {
		//only option is to show ADD
		method = "A";
	} 
	else {

	    //add entries to "pop up" for each schedule entry in selected cell
	    for (var item = 0; item < cell.childNodes.length; item++) {
	        strClassname = cell.childNodes[item].className;
	        if (strClassname.indexOf("scheduleJob") != -1) {
			    tasksCount = parseInt(tasksCount) + 1;
			    var customer = document.getElementById("Cust_" + cell.childNodes[item].id);	
    			
			    //if multiple then offer option to edit the series
			    if(flgCanUpdate==1) {
			        if(customer.className=='SERIES') {
			            tblScheduleTasks += "<tr id='tr_" + cell.childNodes[item].id + "'><td><img alt='Edit Schedule' src='/lib/img/edit-icon-32.png' onclick='javascript:openScheduleDetail(\"" + cell.childNodes[item].id + "\", \"\",0);' /><img alt='Edit Multiple' src='/lib/img/series-icon-32.png' onclick='javascript:openScheduleDetail(\"" + cell.childNodes[item].id + "\", \"\",1);' /></td><td>" + customer.innerHTML + "</td><td><img alt='Delete Schedule' src='/lib/img/bin-32x32.png' onclick='javascript:deleteScheduleDetail(\"" + cell.childNodes[item].id + "\");'></td></tr>";
			        } else {		    
			            //otherwise just single
			            tblScheduleTasks += "<tr id='tr_" + cell.childNodes[item].id + "'><td><img alt='Edit Schedule' src='/lib/img/edit-icon-32.png' onclick='javascript:openScheduleDetail(\"" + cell.childNodes[item].id + "\", \"\",0);' /></td><td>" + customer.innerHTML + "</td><td><img alt='Delete Schedule' src='/lib/img/bin-32x32.png' onclick='javascript:deleteScheduleDetail(\"" + cell.childNodes[item].id + "\");'></td></tr>";
			        }
			    } else {
			        tblScheduleTasks += "<tr id='tr_" + cell.childNodes[item].id + "'><td colspan='2'>" + customer.innerHTML + "</td></tr>";
			    }
			}
		}
	}
	
	//Complete "pop up" table
	    tblScheduleTasks += "</tbody>";
	    tblScheduleTasks += "</table>";
	    tblScheduleTasks += "<div class='popupFooter' onmousedown='javascript:dragStart(event,\"ScheduleClickerDiv\");'></div>";

    //Display tasksCount
	    var x = document.getElementById("ScheduleClickerDiv");
	    x.style.display = "";
	    x.innerHTML = tblScheduleTasks;
	    if(flgCanUpdate==1) {
	        x.style.height = (75 + (parseInt(tasksCount) * 41));
	    } else {
	        x.style.height = (30 + (parseInt(tasksCount) * 41));
	    }
	    AssignPosition(x);
}

function HideContent(d) {
	if (d.length < 1) { return; }
	document.getElementById(d).style.display = "none";
}

function ShowContent(d) {
	if (d.length < 1) { return; }
	var dd = document.getElementById(d);
	AssignPosition(dd);
	dd.style.display = "block";
}

function ReverseContentDisplay(d) {
	if (d.length < 1) { return; }
	var dd = document.getElementById(d);
	AssignPosition(dd);
	if (dd.style.display == "none") { dd.style.display = "block"; }
	else { dd.style.display = "none"; }
}

function openScheduleDetail(s, cellid, m) {
    var url = "/lib/http/ScheduleDetail.asp?sid=" + Math.random();
    var method = "M";
    var windowproperties = "dialogWidth:480px; dialogHeight:600px; center: Yes; help: No; Resizable: No; Status: No;";

    if (m != 0) {
        url = "/lib/http/ScheduleDetail_Multiple.asp?sid=" + Math.random();
        method = "M";
        windowproperties = "dialogWidth:950px; dialogHeight:630px; center: Yes; help: No; Resizable: Yes; Status: No;";
    }
    
    //if not existing schedule, open in add mode but pass EPM, user and date values in querystring
    if(isWhitespace(s)) {
        
        //get selected username (td_rownumber_username)
            var x = cellid.split("_");
            var daystoadd = parseInt(x[2]) - 1;
            x[2]="username";
            var username = document.getElementById(x.join("_")).innerHTML;
            url = url + "&su=" + encodeURIComponent(username);
    
        //get selected date based upon (a) searched date and (b) selected column
            var startdate = document.getElementById("startdate").value;
            var x = startdate.split("/");
            var myDate = new Date(x[2], x[1]-1, x[0]);
            myDate.setDate(myDate.getDate() + daystoadd);
            url = url + "&sd=" + encodeURIComponent(myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear());
    
    } else {
        url = url + "&s="  + s;
    }   
    
    var retval = window.showModalDialog(url, "" , windowproperties);     
    
    if(retval) {
       scheduleUI(retval, method);
    } else {
        //Google Chrome seemingly ignores retval - force refresh
        //problem: hitting CANCEL forces refresh too :o/ 
        if (navigator.appName=="Netscape") scheduleUI("", "");
    }
}

function calcScheduleDate(cell) {
        var x = cell.id.split("_");
        var daystoadd = parseInt(x[2]) - 1;

    //get selected date based upon (a) searched date and (b) selected column
        var startdate = document.getElementById("startdate").value;
        var x = startdate.split("/");
        var myDate = new Date(x[2], x[1]-1, x[0]);
        myDate.setDate(myDate.getDate() + daystoadd);
        
        return myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
}

function calcCell(usercell, username, date) {
    //usercell only provided if known - saves having to search again
    try {
        var tblSchedule = document.getElementById("tblSchedule");
        if (usercell == ""){
            var userspans = tblSchedule.getElementsByTagName('span');
            for (i=0; i<userspans.length; i++) {
                if(userspans[i].id.indexOf("_username") != 0) {
                    if(userspans[i].innerHTML == username) {
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
        
            if(col >= 0) {
                var x = usercell.split("_");
                x[2]=col;
                var usercell = document.getElementById(x.join("_"));
                if(usercell) {
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

function deleteScheduleDetail(s) {
     if (confirm("Delete this task from the Schedule?")) {
         try {
             //HTTP delete
             xmlHttp = GetXmlHttpObject()
             if (xmlHttp == null) {
                 alert("Browser does not support HTTP request");
                 return
             }

             var url = "/lib/http/sch_deleteentry.asp?s=" + s;

             xmlHttp.onreadystatechange = function () {
                 if (xmlHttp.readyState == 4) {
                     if (xmlHttp.status == 200) {

                         result = xmlHttp.responseText;
                         if (!isWhitespace(result)) {
                             var resultarr = result.split("|||");
                             if (resultarr[0] == "ERROR") {
                                 alert(resultarr[1]);

                             } else {
                                 //Remove item from UI
                                 //remove popup row
                                 var tr = document.getElementById('tr_' + s);
                                 tr.parentNode.removeChild(tr);
                                 //shrink popup size
                                 var x = document.getElementById("ScheduleClickerDiv");
                                 x.style.height = (parseInt(x.style.height) - 40);
                                 //remove span from schedule
                                 var span = document.getElementById(s);
                                 span.parentNode.removeChild(span);

                             }
                         }
                     }
                 }
             }

             xmlHttp.open("GET", url, true);
             xmlHttp.send(null);

         } catch (e) {
             alert(e.message);
         }

    }
}

function checkValues(s) {
    var errorstring = "";
    var errMessages = new Array();
    var cntChanges = 0;

    if (s == "scheduleDetail") {
        if (isWhitespace(document.getElementById("customername").value)) { errMessages[errMessages.length] = '\nCustomer Name'; }
        if (isWhitespace(document.getElementById("scheduledate").value)) { errMessages[errMessages.length] = '\nDate'; }
        if (isWhitespace(document.getElementById("schedulehoursstr").value)) { errMessages[errMessages.length] = '\nHours'; }

        //only pass the visible element
        if(document.getElementById("selNumDay").style.display == "none") {document.getElementById("AddMode_Duration").value = "";}
        if(document.getElementById("selEndDate").style.display == "none") {document.getElementById("AddMode_EndDate").value = "";}
    }

    if (s == "scheduleDetailMultiple") {
        var cntSelected = parseInt(document.getElementById("cntSelected").value);
        if (cntSelected == 0) {
            errMessages[errMessages.length] = '\nNo entries selected';
        } else {
            if (document.getElementById("method").value != "MD") {
                //at least one entry selected.  verify that at least one change has been requested ####################
                var schedulecategorya = document.getElementById("schedulecategorya");
                var customername = document.getElementById("customername");
                var schedulelocation = document.getElementById("schedulelocation");
                var scheduleHoursSTR = document.getElementById("scheduleHoursSTR");
                var currencycode = document.getElementById("currencycode");
                var schedulerevenue_rate = document.getElementById("schedulerevenue_rate");
                var schedulecost_rate = document.getElementById("schedulecost_rate");
                var company_dollar = document.getElementById("company_dollar");
                var linktype = document.getElementById("linktype");
                var linkid = document.getElementById("linkid");
                var spanlinkid = document.getElementById("spanlinkid");

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
                if (scheduleHoursSTR.style.display != "none") {
                    if (scheduleHoursSTR.value == "") {
                        errMessages[errMessages.length] = '\nHours';
                    } else {
                        cntChanges += 1;
                    }
                } else {
                    scheduleHoursSTR.value = "";
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
                if (schedulecategorya.value != "") { cntChanges += 1 }
                if (currencycode.value != "") { cntChanges += 1 }
                if (company_dollar.value != "") { cntChanges += 1 }

                if (cntChanges == 0) {
                    errMessages[errMessages.length] = '\nNo changes supplied';
                }
            }
            
        }
    }

    retval = true;
    for (i = 0; i < errMessages.length; i++) {
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

function scheduleUI (arrSchedule, method) {
    //receives array of scheduleID, username, date, content
    //adds/edits/deletes existing entries accordingly
    //works as an alternative to forcing refresh of the Schedule (theoretically reduced client/server overhead)
    if (arrSchedule.length == 0) {
        window.location.reload();
    } else {
    
        if(arrSchedule.length!=0) {
            for(si=0; si<arrSchedule.length; si++) {
                var scheduleID = arrSchedule[si][0];
                if(!isWhitespace(scheduleID)) {
                    var s = document.getElementById(scheduleID);
                    
                    var username = arrSchedule[si][1];
                    var strScheduleDate = arrSchedule[si][2];
                    var scheduleColour = arrSchedule[si][3];
                    var calendarEntry = arrSchedule[si][4];
                    var CustomerName = arrSchedule[si][5];
                    
                    var ce = document.getElementById(calcCell("", username, strScheduleDate));

                    var flgExists=0;
                    var flgCellExists=0;
                    
                    //Does scheduleID exist?
                        if(s) flgExists=1;
                    
                                       
                    //Should scheduleID exist?
                        if (ce) flgCellExists=1;
                    
                    if (flgExists == 1) {
                        if(flgCellExists == 1) {
                            //alert("MODIFY");
                            if(method == "M") {
                                //either delete or update depending upon the recordset.
                                //a delete only has scheduleID set (all else null)
                                if(CustomerName=="" && calendarEntry=="") {
                                    s.parentNode.removeChild(s);
                                } else {
                                    s.innerHTML = calendarEntry;
                                    if(!isWhitespace(scheduleColour)) s.style.backgroundColor = scheduleColour; 
                                    //still need Cust_ element sorting too
                                    ce.appendChild(s);
                                }
                                
                            
                            } else {
                                ce.appendChild(s);
                            }
                            
                        } else {
                            //alert("REMOVE ELEMENT");
                            s.parentNode.removeChild(s);
                        }
                    } else {
                        if(flgCellExists==1) {
                            //alert("CREATE ELEMENT");
                            var newspan=document.createElement("span");
                            newspan.id = scheduleID;
                            newspan.className = "scheduleJob";
                            newspan.innerHTML = calendarEntry;
                            if(!isWhitespace(scheduleColour)) newspan.style.backgroundColor = scheduleColour; 
                            ce.appendChild(newspan);
                            
                            var newspan=document.createElement("span");
                            newspan.id = "Cust_" + scheduleID;
                            newspan.style.display = "none";
                            newspan.innerHTML = CustomerName;
                            ce.appendChild(newspan);
                            //still needs onclick code
                                                       
                        //} else {
                            //alert("NO ACTION");
                            
                        }
                    }
                    
                    
                }
            }
        
        }
    
    }
}

function chkSelect(chk) {
    var status = chk.checked;
    var changed = 0;
    var cnt = parseInt(document.getElementById("cntSelected").value);
    var trid = "";
    var existingclass = "";
    var newclass = "";
    var elementid = "";

    //multiple 
    if (chk.id == "chkALL" || chk.id.indexOf("chkMonth") == 0) {
        if (chk.id == "chkALL") {
            elementid = "tblScheduleList";
        } else {
            elementid = chk.id.replace("chkMonth", "tbMonth");
        }

        var t = document.getElementById(elementid);
        var arrinput = t.getElementsByTagName("input");
        for (i = 0; i < arrinput.length; i++) {
            if (arrinput[i].id != chk.id) {
                if (arrinput[i].checked != status) {
                    arrinput[i].checked = status;
                    if (arrinput[i].id.indexOf("chkItem") == 0) {
                        changed += 1;
                        trid = arrinput[i].id.replace("chkItem", "tr");
                        existingclass = document.getElementById(trid).className;
                        newclass = existingclass.replace("SEL", "");
                        if (status) {newclass = newclass + "SEL";}
                        document.getElementById(trid).className = newclass;
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
        existingclass = document.getElementById(trid).className;
        newclass = existingclass.replace("SEL", "");
        

        if (chk.checked) {
            cnt += 1;
            newclass = newclass + "SEL";
        } else {
            cnt -= 1;
        }

        document.getElementById(trid).className = newclass;
    }
    setChangeList();
    document.getElementById("cntSelected").value = cnt;
}

function setMethod(method) {
    if(document.getElementById("method")) {
        document.getElementById("method").value = method;
        
        if(checkValues('scheduleDetailMultiple')) {
            document.getElementById("frmChanges").submit();
        }
    }
}

function setChangeList() {
    var t = document.getElementById("tblScheduleList");
    var bulklist = document.getElementById("bulklist");
    var arrinput = t.getElementsByTagName("input");
    bulklist.value = "";
    var id = "";
    for (i = 0; i < arrinput.length; i++) {
        if (arrinput[i].id.indexOf("chkItem") == 0) {
            id = arrinput[i].id.replace("chkItem", "");
            if (arrinput[i].checked) {
                bulklist.value += id + ",";
            }
        }
    }
}

function centredElement(popup) {

    /* Displays an element (typically a DIV) centred horizontally
    AND vertically on the page */

    document.getElementById(popup).style.display = 'block';
    
    var viewportwidth;
    var viewportheight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
        viewportheight = window.innerHeight
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth,
        viewportheight = document.documentElement.clientHeight
    }
    // older versions of IE
    else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
        viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }

    divHeight = document.getElementById(popup).offsetHeight;
    divWidth = document.getElementById(popup).offsetWidth;

    getViewportScrollY = function() {
        var branchid = 0;
        var scrollY = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            branchid = 1;
            scrollY = document.documentElement.scrollTop;
        }
        else if (document.body && document.body.scrollTop) {
            branchid = 2;
            scrollY = document.body.scrollTop;
        }
        else if (window.pageYOffset) {
            branchid = 3;
            scrollY = window.pageYOffset;
        }
        else if (window.scrollY) {
            branchid = 4;
            scrollY = window.scrollY;
        }
        //alert(scrollY + '\n' + branchid);
        return scrollY;
    };

    var newTop = getViewportScrollY() + (viewportheight / 2) - (divHeight / 2);
    var newLeft = (viewportwidth / 2) - (divWidth / 2);

    document.getElementById(popup).style.top = newTop + 'px';
    document.getElementById(popup).style.left = newLeft + 'px';
}

function changeLink(e) {
    var span = document.getElementById("spanlinkid");
    var label = document.getElementById("lbllinkid");
    var linkid = document.getElementById("linkid");
    //alert(label.style.display);
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

function toggleElements(showid, hideid, blankid) {
    if (document.getElementById(showid) && document.getElementById(hideid)) {
        document.getElementById(showid).style.display = "";
        document.getElementById(hideid).style.display = "none";
        document.getElementById(blankid).value = "";
    }
}

function navSelectDate(datefieldid, datevalue, formid) {
    if (document.getElementById(datefieldid)) {
        document.getElementById(datefieldid).value = datevalue;
        document.getElementById(formid).submit();
    }
}









