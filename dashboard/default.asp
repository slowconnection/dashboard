<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<!--#include virtual="/lib/ssi/sr_functions.asp" -->
<%
    'On Error Resume Next
    CurrentPageID = 263   
    r = 1

    filter_account = Request.Form("filter_account")
    filter_offering = Request.Form("filter_offering")
    filter_region = Request.Form("filter_region")
    filter_subregion = Request.Form("filter_subregion")
    filter_year = Request.Form("filter_year")
    filter_quarter = Request.Form("filter_quarter")
    filter_timeframe = Request.Form("filter_timeframe")
    filter_dashboard = Request.Form("filter_dashboard")
    
    if filter_dashboard = "" then filter_dashboard = "1"
    if filter_timeframe = "" then filter_timeframe = "1"
    if filter_year = "" then filter_year = "1"

    Set conn = Server.CreateObject("ADODB.Connection")
    conn.Open(SQ01_STRING)
    Set cmd = Server.CreateObject("ADODB.Command")
    cmd.ActiveConnection = conn

    'Access Log
    cmd.CommandText = "ADMIN_MaintainAccessLog"
    cmd.CommandType = 4
    cmd.Parameters("@menuitem_id") = Server.HTMLEncode(CurrentPageId)
    cmd.Parameters("@username") = Server.HTMLEncode(loginName)
    cmd.Execute

    'Subregion Name
    selectedSubRegion = ""
    If filter_subregion <> "" Then
        Set rs = Server.CreateObject("ADODB.Recordset")
        cmd.CommandText = "api.GetSubRegionName"
        cmd.CommandType = 4 'adCmdStoredProc
        cmd.Parameters("@filterSubRegion") = Server.HTMLEncode(filter_subregion)

        rs.Open cmd, , adOpenForwardOnly, adLockReadOnly

        If Not rs.EOF Then 
            selectedSubRegion = rs("subregion_name")
        End If

        rs.Close
        Set rs = Nothing
    End If

    'Account Name
    selectedAccount = ""
    If filter_account <> "" Then
        Set rs = Server.CreateObject("ADODB.Recordset")
        cmd.CommandText = "api.GetAccountName"
        cmd.CommandType = 4 'adCmdStoredProc
        cmd.Parameters("@filterAccount") = Server.HTMLEncode(filter_account)

        rs.Open cmd, , adOpenForwardOnly, adLockReadOnly

        If Not rs.EOF Then 
            selectedAccount = rs("customer_name")
        End If

        rs.Close
        Set rs = Nothing
    End If

    
    Set cmd = Nothing
    conn.Close
    Set conn = Nothing
%>
<!DOCTYPE html>
<html lang="en-gb">
<head>
    <meta charset="UTF-8">
    <title>Security Reports Dashboard</title>
    <link href="/lib/css/newmenu.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
    <link href="/lib/css/common.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
    <link href="/lib/css/dashboard.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
    <link href="/lib/css/Chart.min.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp" crossorigin="anonymous">
</head>

<body>
    <input type="hidden" id="currentpageid" value="<%=CurrentPageID %>" />
    <input type="hidden" id="selectedSubRegion" value="<%=selectedSubRegion %>" />
    <input type="hidden" id="selectedAccount" value="<%=selectedAccount %>" />

    <div id="page-container">

        <header></header>
        <hr />
        <nav id="menu"></nav>
        <input type="hidden" id="activeMenuHeader" value="" />
        <div style="clear: both">
            <hr />
        </div>

        <div id="content-wrap">

            <!-- FILTERS -->
            <div class="dashboard-title">
                <h1>Security Account Reporting Portal</h1>
            </div>

            <!-- KPI SECTION -->
            <div class="dashboard-container">
                <form method="post" action="default.asp">

                    <div class="dashboard-filter">
                        <div class="account-container">
                            <span class="label">Sub-region:</span>
                            <div class="account-selector" id="subregion_selector"></div>
                        </div>

                        <div class="account-container">
                            <span class="label">Offering:</span>
                            <div class="account-selector" id="offering_selector"></div>
                        </div>

                        <div class="account-container">
                            <span class="label">Account:</span>
                            <div class="account-selector" id="account_selector"></div>
                        </div>

                        <input type="hidden" id="filter_region" name="filter_region" value="<%=filter_region %>" />
                        <input type="hidden" id="filter_subregion" name="filter_subregion" value="<%=filter_subregion %>" />
                        <input type="hidden" id="filter_dashboard" name="filter_dashboard" value="<%=filter_dashboard %>" />
                        <input type="hidden" id="filter_year" name="filter_year" value="<%=filter_year %>" />
                        <input type="hidden" id="filter_quarter" name="filter_quarter" value="<%=filter_quarter %>" />
                        <input type="hidden" id="filter_timeframe" name="filter_timeframe" value="<%=filter_timeframe %>" />
                        <input type="hidden" id="filter_account" name="filter_account" value="<%=filter_account %>" />
                        <input type="hidden" id="filter_offering" name="filter_offering" value="<%=filter_offering %>" />
                    
                        <div class="links-container">
                            <a id="trainingButton" href="#">☰</a>&nbsp;SDL Training
                        </div>
                        <div id="trainingMenu">
                            <ul>
                                <li>
                                    <a target="_training" 
                                        href="https://dxcportal-my.sharepoint.com/:b:/g/personal/andrew_johnson5_dxc_com/EZMsOzeEdEdMldzfr1DXz2cBsoGm0j72g_n7SC4WVrzWnQ?e=lv8t35">
                                        <i class="fas fa-file-pdf" title="25 page PDF">&nbsp;Finance Basics</i>
                                    </a>
                                </li>
                                <li>
                                    <a target="_training" 
                                        href="https://dxcportal-my.sharepoint.com/:v:/g/personal/andrew_johnson5_dxc_com/Ed5bySys_GNHq2VQWXR9NGEBOhs9F1AIBNIIg0WqdTz_vQ?e=z723RK">
                                        <i class="fas fa-play-circle" title="1 hour video">&nbsp;Finance Basics</i>
                                    </a>
                                </li>
                                <li>
                                    <a target="_training" 
                                        href="https://dxcportal-my.sharepoint.com/:v:/g/personal/andrew_johnson5_dxc_com/EbC6qMf-KNFPm9Sp-zre4CQBV58WXMO2YN5-hCWphONuMA?e=4irPTD">
                                        <i class="fas fa-play-circle" title="1 hour video">&nbsp;Finance Management for SDLs - Session 1</i>
                                    </a>
                                </li>
                                <li>
                                    <a target="_training" 
                                        href="https://dxcportal-my.sharepoint.com/:v:/g/personal/andrew_johnson5_dxc_com/EZMLlcWlO9NMlde_q0S9PFkBYe1-phch8-327uSAMImKDw?e=9gbNbo">
                                        <i class="fas fa-play-circle" title="1 hour video">&nbsp;Finance Management for SDLs - Session 2</i>
                                    </a>
                                </li>
                                <li>
                                    <a target="_training" 
                                        href="https://dxcportal-my.sharepoint.com/:v:/g/personal/andrew_johnson5_dxc_com/ESZH15WZcvVMg7aRiriJ7iYBnb5M5SgWP3s6tl5dervE7w?e=evogu1">
                                        <i class="fas fa-play-circle" title="1 hour video">&nbsp;Finance Management for SDLs - Dashboard Hands On</i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </form>

                <!-- DASHBOARD SECTION PLACEHOLDER -->
                <div class="dashboard-sidebar"></div>

                 <!-- KPI SECTION PLACEHOLDER -->
                <div id="kpi-container" class="kpi-container">
                    <template id="kpi-template">
                        <div class="kpi">
                            <header class="kpi-header"></header>
                            <section class="kpi-body"></section>
                            <footer class="kpi-footer"></footer>
                        </div>
                    </template>
                </div>

                <!-- COMPONENTS SECTION PLACEHOLDER -->
                <div id="components-container" class="components-container">
                    <template id="component-template">
                        <div class="component">
                            <header class="component-header"></header>
                            <section class="component-body"></section>
                            <footer class="component-footer"></footer>
                        </div>
                    </template>
                </div>

            </div>

            <div id="drilldownModal" class="modal">
                <div id="drilldownDetail">
                    <div class="drilldownWrapper">
                        <div id="drilldownCaption" class="popupCaption">
                                <span></span>
                                <img alt="Close" src="/lib/img/close-icon-32.png" id="closeDrilldown" />
                        </div><!--close popupCaption-->
                        <div id="drilldownContent" class="drilldownContent"></div>
                    </div>
                </div>

            </div>

            <div id="infoModal" class="modal">
                <div id="infoDetail">
                    <div class="drilldownWrapper">
                        <div id="infoCaption" class="popupCaption">
                                <span></span>
                                <img alt="Close" src="/lib/img/close-icon-32.png"  id="closeInfo" />
                        </div><!--close popupCaption-->
                        <div id="infoContent" class="drilldownContent"></div>
                    </div>
                </div>
            </div>

            <div id="zoomModal" class="modal">
                <div id="zoomDetail">
                    <div class="drilldownWrapper">
                        <div id="zoomCaption" class="popupCaption">
                                <span></span>
                                <img alt="Close" src="/lib/img/close-icon-32.png"  id="closeZoom" />
                        </div><!--close popupCaption-->
                        <div id="zoomContent" class="drilldownContent"></div>
                    </div>
                </div>
            </div>

        </div>
        <!--close content-wrapper-->
    </div>


    <script src="/lib/scripts/page.js?t=<%=js_cache %>" defer></script>
    <script src="/lib/scripts/Chart.js?t=<%=js_cache %>" defer></script>
    <script src="/lib/scripts/chartjs-plugin-datalabels.min.js?t=<%=js_cache %>" defer></script>
    <script type="text/javascript">
        const trainingButton = document.querySelector('#trainingButton');
        const trainingMenu = document.querySelector('#trainingMenu');

        trainingButton.addEventListener('click', event => {
            event.preventDefault();
            trainingMenu.style.setProperty('--mouse-x', (event.clientX - 20) + 'px');
            trainingMenu.style.setProperty('--mouse-y', (event.clientY - 20) + 'px');
            trainingMenu.style.display = 'block';

            trainingMenu.addEventListener('mouseleave', event => trainingMenu.style.display = 'none');
        });
    </script>

    <script type="module" src="./default.js?t=<%=js_cache %>"></script>
</body>
</html>

