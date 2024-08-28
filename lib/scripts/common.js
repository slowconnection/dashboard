//Global variables
//var xmlHttp;
var timeout = 500;
//var closetimer = 0;
var ddmenuitem = 0;
var browser = new Browser();
var dragObj = {};
var cX = 0; var cY = 0; var rX = 0; var rY = 0;

dragObj.zIndex = 0;

function UpdateCursorPosition(e) { cX = e.pageX; cY = e.pageY; }

function UpdateCursorPositionDocAll(e) { cX = event.clientX; cY = event.clientY; }
if (document.all) { document.onmousemove = UpdateCursorPositionDocAll; }
else { document.onmousemove = UpdateCursorPosition; }

function GetXmlHttpObject() {
    var xmlHttp = null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
        //Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}



function isWhitespace(s) {
    var i;
    var whitespace = " \t\n\r";
    if (isEmpty(s)) return true;
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (whitespace.indexOf(c) == -1) return false;
    }
    return true;
}

function isEmpty(s) {
    return ((s == null) || (s.length == 0));
}

function isValidDate(d) {
    var reDate = /(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[0-2])\/(?:19|20\d{2})/;
    return reDate.test(d);
}

function isValidEmail(s) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(s) == false) {
        return false;
    }
    return true;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function IsNumeric(input) {
    return (input - 0) == input && input.length > 0;
}

function convDate(d) {
    if (d.indexOf("/") != 0) {
        var x = d.split("/");
        //convert to UTC to avoid problems with daylight saving.
        var myDate = new Date(Date.UTC(x[2], x[1] - 1, x[0]));
        return myDate;
    } else {
        return null;
    }
}

function AssignPosition(d) {
    if (self.pageYOffset) {
        rX = self.pageXOffset;
        rY = self.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop) {
        rX = document.documentElement.scrollLeft;
        rY = document.documentElement.scrollTop;
    }
    else if (document.body) {
        rX = document.body.scrollLeft;
        rY = document.body.scrollTop;
    }
    if (document.all) {
        cX += rX;
        cY += rY;
    }
    if (cX > 600) { cX = cX - 400; }

    d.style.left = (cX + 10) + "px";
    d.style.top = (cY + 10) + "px";
}

function AssignPositionOffset(d, x, y) {
    var sw = screen.availWidth / 2,
        adj = sw * 0.8;

    if (self.pageYOffset) {
        rX = self.pageXOffset;
        rY = self.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop) {
        rX = document.documentElement.scrollLeft;
        rY = document.documentElement.scrollTop;
    }
    else if (document.body) {
        rX = document.body.scrollLeft;
        rY = document.body.scrollTop;
    }
    if (document.all) {
        cX += rX;
        cY += rY;
    }
    cX += x;
    cY += y;
    if (cX > sw) { cX = cX - adj; }

    d.style.left = (cX + 10) + "px";
    d.style.top = (cY + 10) + "px";
}

function AssignPositionCentre(d) {
    var winWidth = 0, winHeight = 0, popWidth= 0, popHeight = 0, cX = 0, cY = 0, sY = 0;

    try {
        //var winWidth, winHeight;
        if (self.innerHeight) {
            winWidth = self.innerWidth;
            winHeight = self.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
            winWidth = document.documentElement.clientWidth;
            winHeight = document.documentElement.clientHeight;
        }
        else if (document.body) {
            winWidth = document.body.clientWidth;
            winHeight = document.body.clientHeight;
        }

        if (d.style.width == "") {
            popWidth = 400;
            popHeight = 400;
        } else {
            popWidth = d.style.width.replace("px", "");
            popHeight = d.style.height.replace("px", "");
        }

        //Scrolled?
        sY = document.documentElement.scrollTop;

        cX = (winWidth / 2) - (popWidth / 2);
        cY = (winHeight / 2) - (popHeight / 2) + sY;

        //if(d.parentNode.id=="popupDetail") {cX=0; cY=200;}

        d.style.left = cX + "px"; //(cX + 10) + "px";
        d.style.top = cY + "px"; //(cY + 40) + "px";
    } catch (err) {
        alert("AssignPositionCentre: " + err.description);
    }

}

function Browser() {
    var ua, s, i;
    this.isIE = false;
    this.isNS = false;
    this.version = null;
    ua = navigator.userAgent;
    s = "MSIE";
    if ((i = ua.indexOf(s)) >= 0) {
        this.isIE = true;
        this.version = parseFloat(ua.substr(i + s.length));
        return;
    }

    s = "Netscape6/";
    if ((i = ua.indexOf(s)) >= 0) {
        this.isNS = true;
        this.version = parseFloat(ua.substr(i + s.length));
        return;
    }

    // Treat any other "Gecko" browser as NS 6.1.

    s = "Gecko";
    if ((i = ua.indexOf(s)) >= 0) {
        this.isNS = true;
        this.version = 6.1;
        return;
    }

}

function dragStart(event, id) {
    var x, y;
    
    // If an element id was given, find it. Otherwise use the element being
    // clicked on.
    if (id)
        dragObj.elNode = document.getElementById(id);
    else {
        if (browser.isIE)
            dragObj.elNode = window.event.srcElement;
        if (browser.isNS)
            dragObj.elNode = event.target;

        // If this is a text node, use its parent element.

        if (dragObj.elNode.nodeType == 3)
            dragObj.elNode = dragObj.elNode.parentNode;
    }

    // Get cursor position with respect to the page.
    if (browser.isIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    if (browser.isNS) {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }

    // Save starting positions of cursor and element.

    dragObj.cursorStartX = x;
    dragObj.cursorStartY = y;
    dragObj.elStartLeft = parseInt(dragObj.elNode.style.left, 10);
    dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);

    if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
    if (isNaN(dragObj.elStartTop)) dragObj.elStartTop = 0;

    // Update element's z-index.

    dragObj.elNode.style.zIndex = ++dragObj.zIndex;

    // Capture mousemove and mouseup events on the page.

    if (browser.isIE) {
        document.attachEvent("onmousemove", dragGo);
        document.attachEvent("onmouseup", dragStop);
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    if (browser.isNS) {
        document.addEventListener("mousemove", dragGo, true);
        document.addEventListener("mouseup", dragStop, true);
        event.preventDefault();
    }
}

function dragGo(event) {

    var x, y;

    // Get cursor position with respect to the page.

    if (browser.isIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    if (browser.isNS) {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }

    // Move drag element by the same amount the cursor has moved.

    dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
    dragObj.elNode.style.top = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";

    if (browser.isIE) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    if (browser.isNS)
        event.preventDefault();
}

function dragStop(event) {

    // Stop capturing mousemove and mouseup events.

    if (browser.isIE) {
        document.detachEvent("onmousemove", dragGo);
        document.detachEvent("onmouseup", dragStop);
    }
    if (browser.isNS) {
        document.removeEventListener("mousemove", dragGo, true);
        document.removeEventListener("mouseup", dragStop, true);
    }
}

function quoteReplace(s) {
    //var s = String(s).replace(/\'/g, "&#39;");
    //s = String(s).replace(/\"/g, "&#34;");
    //return s;
    return String(s).replace(/\'/g, "&#39;").replace(/\"/g, "&#34;");
}

function quoteRemove(s) {
    //var s = String(s).replace(/\'/g, "").replace(/\"/g, "");
    return String(s).replace(/\'/g, "").replace(/\"/g, "");
}

function showElement(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = '';
    }

}

function showInlineElement(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = 'inline-block';
    }

}

function hideElement(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = 'none';
    }
}

function RemoveElement(id) {
    if (document.getElementById(id)) {
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }
}

function toggleElement(id) {
    if (document.getElementById(id)) {
        if (document.getElementById(id).style.display == 'none') {
            document.getElementById(id).style.display = '';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }
}

function sorter(o) {
    try {
        //alert(document.getElementById("sortorder"));
        if (document.getElementById("sortorder")) {
            
            document.getElementById("sortorder").value = o;
            document.getElementById("newsortorder").value = "1";
            //document.forms[0].submit();
            document.getElementById("vistorm").submit();
        }
    } catch (e) {
        return false;
    }
}

function columnsorter(o, id) {
    if (id == "") { id = "filter_sortorder";}

    try {
        //alert(document.getElementById("sortorder"));
        if (document.getElementById(id)) {

            if(document.getElementById(id).value!=o) {
                document.getElementById(id).value = o;
                document.getElementById("vistorm").submit();
            }
        }
    } catch (e) {
        return false;
    }
}

function btnConfirm(e, msg) {
    if (!confirm(msg)) {
        event.returnValue = false;
    }
}

function hideItem(id) {
    document.getElementById(id).style.display = "none";
}

function cursor_wait() {
    document.body.style.cursor = "wait";
}

function cursor_clear() {
    document.body.style.cursor = "default";
}

function fillListAfromB(sourceList, destList) {
    let sourceListLength = sourceList.length;
    let destListLength = destList.length;
    if (destListLength <= 2) {
        for (let i = 0; i < sourceListLength; i++) {
            destList.options[i + destListLength] = new Option(sourceList[i].text, sourceList[i].value);
        }
    }
}

function quoteReplace(s) {
    //var lsRegExp = /'/g;
    //return String(s).replace(lsRegExp, "&#39;");
    //s = String(s).replace(/\'/g, "&#39;");
    //s = String(s).replace(/\"/g, "&#34;");

    var strReplaceAll = s;
    var intIndexOfMatch = strReplaceAll.indexOf("'");
    while (intIndexOfMatch != -1) {
        strReplaceAll = strReplaceAll.replace("'", "");
        intIndexOfMatch = strReplaceAll.indexOf("'");
    }

    return strReplaceAll;
}

function http_getResults(url, params, movewindow) {
    try {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xmlHttp.setRequestHeader("Content-length", params.length);

        xmlHttp.onreadystatechange = function () {
            return function () {
                if (this.readyState != 4)
                    return;
                if (this.status == 200) {
                    try {
                        var result = xmlHttp.responseText;
                        var x = document.getElementById("popupDetail");
                        x.style.display = "";
                        x.innerHTML = result;
                        if (movewindow == 1) {
                            AssignPositionCentre(x);
                        }
                    }
                    catch (err) {
                        alert("http_getResults:" + err.description);
                    }
                } else { alert("ERROR:" + this.status); }
            };
        } ();
        xmlHttp.send(params);
    } catch (err) {
        alert(err.description);
    }
}

function http_getDetail(url, params, movewindow, alerttext, divName) {
    try {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xmlHttp.setRequestHeader("Content-length", params.length);
        xmlHttp.onreadystatechange = function () {
            return function () {
                if (this.readyState != 4)
                    return;
                if (this.status == 200) {
                    try {
                        var result = xmlHttp.responseText;

                        //divName = divName || "popupDiv";
                        var popupDiv = document.getElementById(divName);
                        popupDiv.style.display = "";
                        popupDiv.innerHTML = result;

                        if (document.getElementById("alerttd") && !isWhitespace(alerttext)) {
                            document.getElementById("alerttd").innerHTML = alerttext;
                        }

                        if (movewindow == 1) {
                            AssignPosition(popupDiv);
                        } else if (movewindow == 2) {
                            AssignPositionCentre(popupDiv);
                        } else if (movewindow == 3) {
                            AssignPositionOffset(popupDiv, 0, -200);
                        }

                    }
                    catch (err) {
                        alert("HTTP_getDetail:" + err.description);
                    }
                } else { alert("ERROR:" + this.status + "\n" + xmlHttp.responseText); }
            };
        } (divName);

        xmlHttp.send(params);
    } catch (err) {
        alert("HTTP_getDetail: " + err.description);
    }
}

function http_getDetailCallback(url, params, cFunction) {
    try {
        var xhr = new XMLHttpRequest(),
            method = "POST";

        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xhr.timeout = 3000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //console.log(xhr.responseText);
                cFunction(xhr);
            }
        };
        //console.log(params);
        xhr.send(params);

    } catch (err) {
        alert("HTTP_getDetailCallback: " + err.description);
    }
}

function http_getDetailSync(url, params, movewindow, alerttext, divName) {
    //Synchronous (now deprecated so at risk of ceasing to be supported by upcoming browser revisions)
    try {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, false);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xmlHttp.setRequestHeader("Content-length", params.length);
        xmlHttp.onreadystatechange = function () {
            return function () {
                if (this.readyState != 4)
                    return;
                if (this.status == 200) {
                    try {
                        var result = xmlHttp.responseText;
                        //divName = divName || "popupDiv";
                        var popupDiv = document.getElementById(divName);
                        popupDiv.style.display = "";
                        popupDiv.innerHTML = result;

                        if (document.getElementById("alerttd") && !isWhitespace(alerttext)) {
                            document.getElementById("alerttd").innerHTML = alerttext;
                        }

                        if (movewindow == 1) {
                            AssignPosition(popupDiv);
                        } else if (movewindow == 2) {
                            AssignPositionCentre(popupDiv);
                        } else if (movewindow == 3) {
                            AssignPositionOffset(popupDiv, 0, -200);
                        }

                    }
                    catch (err) {
                        alert("HTTP_getDetail:" + err.description);
                    }
                } else { alert("ERROR:" + this.status + "\n" + xmlHttp.responseText); }
            };
        }(divName);

        xmlHttp.send(params);
    } catch (err) {
        alert("http_getDetailSync: " + err.description);
    }
}

function http_FindValue(url, params, div) {
    try {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xmlHttp.setRequestHeader("Content-length", params.length);
        xmlHttp.onreadystatechange = function () {
            return function () {
                if (this.readyState != 4)
                    return;
                if (this.status == 200) {
                    try {
                        var result = xmlHttp.responseText;
                        document.getElementById(div).innerHTML = result;
                    }
                    catch (err) {
                    }
                }
                //else {alert("ERROR:" + this.status + "\n" + xmlHttp.responseText);}
            };
        }(div);

        xmlHttp.send(params);
    } catch (err) {
        //alert(err.description);
    }
}

function subMenuDiv(showid, hideid) {
    var sdiv = document.getElementById("divTab" + showid);
    var sbody = document.getElementById("Tab" + showid);
    var hdiv = document.getElementById("divTab" + hideid);
    var hbody = document.getElementById("Tab" + hideid);

    sdiv.style.display = "";
    sbody.style.display = "";

    hdiv.style.display = "none";
    hbody.style.display = "none";

}

function checkRequiredFields(id) {
    /*
    id = parent element (typically a tbody or div)
    if the parent element is visible, build an array of child TH elements
    iterate TH array and build LBL array of elements with id commencing "lbl_"
    iterate LBL array and ensure the associated field (same ID but with the "lbl_" prefix removed), if both label and field are visible, isn't empty
    return a list of visible labels where the associated field is empty
    */
    var strResult = "";
    var arrLBL = []; //new Array();
    var ix = 0;
    try {
        if (document.getElementById(id)) {
            var element = document.getElementById(id);
            if (element.style.display != "none") {
                var arrTH = element.getElementsByTagName("th");

                //Build array of all child th elements with id starting "lbl_"
                for (ix = 0; ix < arrTH.length; ix++) {
                    if (arrTH[ix].id.indexOf("lbl_") == 0) {
                        arrLBL[arrLBL.length] = arrTH[ix];
                    }
                }

                //Ensure all required fields have value
                for (ix = 0; ix < arrLBL.length; ix++) {
                    var fid = arrLBL[ix].id.replace("lbl_", "");
                    if (document.getElementById(fid)) {
                        var f = document.getElementById(fid);
                        if (isWhitespace(f.value) && f.style.display != "none" && arrLBL[ix].style.display != "none") {
                            var lblid = "lbl_" + f.id;
                            if (document.getElementById(lblid)) {
                                strResult += "* " + document.getElementById(lblid).innerHTML.replace(/(<([^>]+)>)/ig, "") + "\n";
                            }
                        }
                    }
                }

            }
        }
    } catch (e) {
        alert("ERROR: " + id + " - " + e.description);
    }

    return strResult;
}

function TextAreaHandler(field, eventtype, textrows, maxchars) {
    //var divid = 'div' + field.name.toLowerCase() + 'len';
    //var counterid = field.name.toLowerCase() + 'len';
    //var divhelp = 'Help_' + field.name;
    var divid = 'div' + field.id + 'len';
    var counterid = field.id + 'len';
    var divhelp = 'Help_' + field.id;
    try {
        switch (eventtype) {
            case 'BLUR':
                document.getElementById(divid).style.display = 'none';
                if (textrows != 0) { document.getElementById(field.id).rows = textrows; }
                if (document.getElementById(divhelp)) { document.getElementById(divhelp).style.display = 'none'; }
                break;
            case 'FOCUS':
                document.getElementById(divid).style.display = 'inline';
                if (textrows != 0) { document.getElementById(field.id).rows = textrows; }
                if (document.getElementById(divhelp)) { document.getElementById(divhelp).style.display = 'inline'; }
                break;
            case 'KEYDOWN':
                textCounter(field, document.getElementById(counterid), maxchars);
                break;
            case 'KEYUP':
                textCounter(field, document.getElementById(counterid), maxchars);
                break;
        }
    } catch (e) {
        alert('TextAreaHandler error: please notify System Developer [Andy Johnson]!' + e.description);
    }

}

function textCounter(field, countfield, maxlimit) {
    if (field.value.length > maxlimit) // if too long...trim it!
        field.value = field.value.substring(0, maxlimit);
    else
        countfield.value = maxlimit - field.value.length;
}

function toggleField(fieldname) {
    //a Change button hides a span and displays the hidden field
    try {
        var span = "span_" + fieldname;
        var btn = "btn_" + fieldname;

        if (document.getElementById(span).style.display == "none") {
            document.getElementById(span).style.display = "";
            document.getElementById(btn).value = "[change]";
            document.getElementById(fieldname).style.display = "none";
        } else {
            document.getElementById(span).style.display = "none";
            document.getElementById(btn).value = "[cancel]";
            document.getElementById(fieldname).style.display = "";
        }

    } catch (e) {
        alert(e.message);
    }

}

function validateNumberRange(obj, minvalue, maxvalue) {
    //attach to the onchange event of an input element.  Ensure input falls within the range
    try {
        if (!IsNumeric(obj.value) || obj.value < minvalue || obj.value > maxvalue) {
            alert("Must be number between " + minvalue + " and " + maxvalue);
            obj.value = "";
            obj.className = "inputerror";
            obj.focus();
        } else {
            obj.className = "inputgood";
        }
    } catch (e) {
        alert(e.message);
    }
    return true;
}

function OpenNewWindow(url) {
    try {
        window.open(url, "_blank");
    } catch (e) {
        alert(e);
    }
}

function btnMultiSelect(item) {
    try {
        var fieldname = item.id.replace("_btn", "");
        var btn = document.getElementById(fieldname + "_btn");
        var div = document.getElementById(fieldname + "_frame");

        if (btn.className == "btnDown") {
            btn.className = "btnUp";
            div.style.display = "";
        } else {
            btn.className = "btnDown";
            div.style.display = "none";
        }
    } catch (e) {
        alert(e);
    }
}

function spnMultiSelect(item) {
    try {
        var ix = item.id.indexOf("_val_");
        var field = item.id.substr(0, ix);
        var fieldcnt = document.getElementById(field + "_cnt");
        var fieldui = document.getElementById(field + "_ui");
        var fieldname = document.getElementById(field);
        var s = item.innerHTML;

        //existing value.  If drilldown used the value will lack a comma, causing new value to be appended (e.g. GermanyNetherlands rather than Germany,Netherlands)
        //insert comma if none exist before adding the new selection
        var existingval = fieldname.value;
        var addcomma = "";
        if(existingval != "") {
            if(existingval.substr(existingval.length - 1) != ",") {addcomma = ","}
        }

        
        var strui = "";
        var classui = "optionL0";
        var cnt = parseInt(fieldcnt.value);
        if (isNaN(cnt)) { cnt = 0;}
        
        if (item.className == "spnMS_on") {
            item.className = "spnMS_off";
            cnt -= 1;
            if(cnt===0) {
                fieldname.value = ""
            } else {
                fieldname.value = fieldname.value.replace(s, "");
            }
        } else {
            item.className = "spnMS_on";
            cnt += 1;
            fieldname.value = fieldname.value + addcomma + s;
        }

        switch (cnt) {
            case 0:
                strui = "";
                classui = "";
                break;
            case 1:
                strui = item.innerHTML;
                break;
            default:
                strui = "(" + cnt + ") Selected";
        }
        fieldui.value = strui;
        fieldui.className = classui;
        fieldcnt.value = cnt;

    } catch (e) {
        alert(e);
    }
}

function bulkMultiSelect(item) {
    //id ends with Y for "select all" and N for "select none"
    var method = item.id.substr(item.id.length - 1);
    var ix = item.id.indexOf("_bulk");
    var fieldid = item.id.substr(0, ix);
    var field = document.getElementById(fieldid);
    var fieldcnt = document.getElementById(fieldid + "_cnt");
    var fieldui = document.getElementById(fieldid + "_ui");
    var frame = document.getElementById(fieldid + "_frame");
    var cnt = parseInt(fieldcnt.value);
    var s = "";
    var strui = "";
    
    var cn = "spnMS_off";
    var cntmod = -1;
    if (method === "Y") {
        cn = "spnMS_on";
        cntmod = 1;
    }

    //iterate all items.  set class name based upon the value of method, managing value of cnt and ui
    var arrFields = frame.getElementsByTagName("span");
    var ix = 0;
    for (ix = 0; ix < arrFields.length; ix++) {
        if (arrFields[ix].className !== cn) {
            s = arrFields[ix].innerHTML + ",";
            arrFields[ix].className = cn;
            cnt += cntmod;
            if (method === "Y") {
                field.value = field.value + s;
            } else {
                field.value = field.value.replace(s, "");
            }
        }
    }
    //console.log(field.value);
    switch (cnt) {
        case 0:
            strui = "";
            fieldui.className = "optionPlaceholder";
            //classui = "";
            break;
        default:
            strui = "(" + cnt + ") Selected";
            fieldui.className = "optionL0";
    }

    if(method === "N") {
        field.value = "";
    } 
    fieldui.value = strui;
    fieldcnt.value = cnt;

}

function resetFilters(id) {
    try {
        var parent = document.getElementById(id);
        var i;
        var item;
        
        //listboxes
        var arr = parent.getElementsByTagName("select");
        for (i = 0; i < arr.length; i++) {
            item = arr[i];
            if (item.id.indexOf("filter_") == 0) {
                item.value = "";
            }
            
        }

        //input boxes
        arr = parent.getElementsByTagName("input");
        for (i = 0; i < arr.length; i++) {
            item = arr[i];
            if (item.id.indexOf("filter_") == 0) {
                item.value = "";
                if (item.className == "optionL0") {
                    item.className = "";
                }
            }

        }

        //multi-select filters
        arr = parent.getElementsByTagName("span");
        for (i = 0; i < arr.length; i++) {
            item = arr[i];
            if (item.id.indexOf("filter_") == 0) {
                if (item.className == "spnMS_on") {
                    item.className = "spnMS_off";
                }
            }

        }

    } catch (e) {
        alert(e.message);
    }
}

function multiselectsearch_onkeyup(id) {
    try {
        var fieldname = id.parentNode.parentNode.id.replace("_frame","");
        var url = "";
        switch (fieldname) {
            case "filter_names":
            case "filter_msnames":
                url = "/lib/http/sch_findemployee.asp";
                break;
            default:
                url = "";
                break;
        }

        var div = id.id.replace("_search", "_results");
        if (!isWhitespace(id.value)) {
            showElement(div);
            url = url + "?sid=" + Math.random();
            var params = "s=" + encodeURIComponent(id.value);
            http_FindValue(url, params, div);

        } else {
            hideElement(div);
        }
    } catch (e) {
        alert(e.message);
    }
}

function multiselectsearch_selected(fieldname, zvalue, zdescription) {
    try {
        //var fieldname = "filter_names";
        var frame = fieldname + "_frame";
        var selectionsframe = frame + "_selections";
        var fieldcnt = document.getElementById(fieldname + "_cnt");
        var cnt = parseInt(fieldcnt.value);
        if (isNaN(cnt)) { cnt = 0; }

        //create container if required
        if (!document.getElementById(selectionsframe)) {
            document.getElementById(frame).style.width = "402px";
            var div = document.createElement("div");
            div.id = selectionsframe;
            div.className = "colMS";
            div.style.height = "300px";
            div.style.width = "200px";
            div.innerHTML = "<br/><b>Selections (click to remove)</b>";
            document.getElementById(frame).appendChild(div);
        }

        //create new element
        var spanid = fieldname + "_select_" + zvalue;
        if (!document.getElementById(spanid)) {
            var span = document.createElement("span");
            span.id = spanid;
            span.innerHTML = zdescription;
            span.className = "spnMS_on";
            span.onclick = function () { multiselectsearch_remove(this); };
            document.getElementById(selectionsframe).appendChild(span);

            //insert into the filter
            document.getElementById(fieldname).value += zvalue + ":" + zdescription + ",";
            cnt += 1;
            fieldcnt.value = cnt;

            //refresh the UI
            multiselectsearch_ui(fieldname);
        }


        //need to add element to the selected list plus the hidden filter field
    } catch (e) {
        alert("multiselectsearch_selected:\n" + e.description);
    }

}

function multiselectsearch_remove(span) {
    try {
        var arr = span.id.split("_select_");
        var fieldname = arr[0];
        var username = arr[1];
        var fullname = span.innerHTML;
        var s = username + ":" + fullname + ",";

        var fieldcnt = document.getElementById(fieldname + "_cnt");
        var cnt = parseInt(fieldcnt.value);
        if (isNaN(cnt)) { cnt = 0; }
        cnt -= 1;
        if (cnt < 0) { cnt = 0; }

        //remove from the filter field
        var filter = document.getElementById(fieldname);
        filter.value = filter.value.replace(s, "");
        fieldcnt.value = cnt;

        //remove the span
        span.parentNode.removeChild(span);

        //update UI
        multiselectsearch_ui(fieldname);

    } catch (e) {
        alert("multiselectsearch_remove:\n" + e.description);
    }
}

function multiselectsearch_ui(fieldname) {
    try {
        var field = document.getElementById(fieldname);
        var fieldui = document.getElementById(fieldname + "_ui");
        var fieldcnt = document.getElementById(fieldname + "_cnt");
        var cnt = parseInt(fieldcnt.value);
        var nameslist = field.value;
        switch (cnt) {
            case 0:
                fieldui.value = "";
                fieldui.className = "";
                break;
            case 1:
                var arr = nameslist.replace(",", "").split(":");
                fieldui.value = arr[1];
                fieldui.className = "optionL0";
                break;
            default:
                fieldui.value = "(" + cnt + ") Selected";
                fieldui.className = "optionL0";
        }


    } catch (e) {
        alert("multiselectsearch_ui:\n" + e.description);
    }
}

//Add getElementsByClassName functionality where unsupported by browser
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (search) {
        var d = document, elements, pattern, i, results = [];
        if (d.querySelectorAll) { // IE8
            return d.querySelectorAll("." + search);
        }
        if (d.evaluate) { // IE6, IE7
            pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
            elements = d.evaluate(pattern, d, null, 0, null);
            while ((i = elements.iterateNext())) {
                results.push(i);
            }
        } else {
            elements = d.getElementsByTagName("*");
            pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
            for (i = 0; i < elements.length; i++) {
                if (pattern.test(elements[i].className)) {
                    results.push(elements[i]);
                }
            }
        }
        return results;
    };
}

function checkbox_tofield(chk, fld, v) {
    //e.g. if v is "NY", checkbox = true will set fld to "Y".  checkbox = false will set "N".
    if (document.getElementById(fld)) {
        if (chk.checked) {
            document.getElementById(fld).value = v.charAt(1);
        } else {
            document.getElementById(fld).value = v.charAt(0);
        }
    }
}

function setFilter(id, s) {
    if (document.getElementById(id)) {
        document.getElementById(id).value = s;
        document.forms[0].submit();
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function closeModal() {
    var modal = document.getElementById("divModal");
    modal.style.display = "none";
}

function pagingNav(url, page) {
    window.location.href = `${url}?r=${page}`;
}

function getPagingHtml(obj) {
    /*
    replaces the legacy (inline VBScript) methodology.  Instead creating the paging after window.load is triggered.
    */
    const recordcount = parseInt(obj.recordcount);
    const page = parseInt(obj.page);
    const pages = parseInt(obj.pages);
    let html = `Results (${recordcount} matches):&nbsp;`;

    let intRangeFrom = parseInt(page/10) * 10;
    let intRangeTo = intRangeFrom + 10;
    if(intRangeTo > pages) intRangeTo = pages;
    if(intRangeFrom === 0) intRangeFrom=1;

    if(page > 9 ) html += `<button class="btnNavFirst" onclick="pagingNav('default.asp',1);"></button>&nbsp;`;
    if(page > 1 ) html += `<button class="btnNavPrevious" onclick="pagingNav('default.asp',${page-1});"></button>&nbsp;`;
    
    for (let i = intRangeFrom; i <= intRangeTo; i++) {
        if(i === page) {
            html += `&nbsp;<span style="font-size:large">${i}</span>&nbsp;`
        } else {
            html += `&nbsp;<a href="default.asp?r=${i}">${i}</a>&nbsp;`
        }
    }

    if(page < pages) html += `&nbsp;<button class="btnNavNext" onclick="pagingNav('default.asp',${page+1});"></button>`;
    if(pages > (intRangeFrom + 10)) html += `&nbsp;<button class="btnNavLast" onclick="pagingNav('default.asp',${pages});"></button>`;
    return `<tr><td>${html}</td></tr>`;
}

function createPaging() {
    try {
        const p = document.getElementById("paging");
        const recordcount = document.getElementById("recordcount").value;
        const page = document.getElementById("page").value;
        const pages = document.getElementById("pages").value;
        p.innerHTML = getPagingHtml({"page":page, "pages":pages, "recordcount":recordcount});
    } 
    catch(e) {
        console.log(`"ERROR: createPaging(); ${e}`);
    }
}

// {element: "id", position: "center"}
function calcPosition(e) {
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