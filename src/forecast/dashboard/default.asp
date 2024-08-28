﻿<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 283
    pageName = "Forecast Dashboard"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "ForecastDashboard"
    cmd.CommandType = adCmdStoredProc
    cmd.NamedParameters = True
    cmd.Parameters("@username") = Server.HTMLEncode(loginName)
    cmd.Parameters("@menuitem_id") = Server.HTMLEncode(menuitem_id)

    'iterate post
    For ix = 1 To Request.Form.Count
        strKey = Request.Form.Key(ix)
        strValue = Server.HTMLEncode(Trim(Request.Form.Item(ix)))
        strFieldName = "@" & strKey
        intFieldType = Cmd.Parameters(strFieldName).Type

        If strKey = "filter_page" Then filter_page = strValue
        If strKey = "filter_sortfield" Then filter_sortfield = strValue
        If strKey = "filter_sortdirection" Then filter_sortdirection = strValue
       
        If intFieldValue = 200 Or strValue <> "" Then
            httpPost = httpPost & strKey & "=" & strValue & "&"
            Cmd.Parameters(strFieldName) = strValue
        End If
    Next

    rs.CursorLocation = 3
    rs.Open cmd, , adOpenForwardOnly, adLockReadOnly

    If Not rs.EOF Then totalRecords = rs("totalRecords")
%>
<!DOCTYPE html>
<html lang="en-gb">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title><%=pageName %></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css" integrity="sha384-eoTu3+HydHRBIjnCVwsFyCpUDZHZSFKEJD0mc3ZqSBSb6YhZzRHeiomAUWCstIWo" crossorigin="anonymous">
    <style type="text/css">
        /* ============ desktop view ============ */
        @media all and (min-width: 760px) {
	        .navbar .nav-item .dropdown-menu{ display: none; }
	        .navbar .nav-item:hover .nav-link{   }
	        .navbar .nav-item:hover .dropdown-menu{ display: block; }
	        .navbar .nav-item .dropdown-menu{ margin-top:0; }
        }	
        /* ============ desktop view .end// ============ */
        </style><link href="/lib/css/styles.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
</head>

<body>
    <div class="container-fluid p-0">

        <input type="hidden" id="menuitem_id" value="<%=menuitem_id %>" />
        <input type="hidden" id="httpPost" value="<%=httpPost %>" />
        <input type="hidden" id="recordCount" value="<%=totalRecords %>" />
        <input type="hidden" id="pageCount" value="<%=int(totalRecords / 15)  %>" />
        

        <header>
            <nav class="navbar navbar-expand-xl navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Security Reports System</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main_nav"  aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="main_nav">
                        <ul class="navbar-nav mx-auto">
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        <main role="main" class="p-1">
            <form method="post" action="default.asp">
                <input type="hidden" name="filter_page" id="filter_page" value="<%=filter_page %>" />
                <input type="hidden" name="filter_sortfield" id="filter_sortfield" value="<%=filter_sortfield %>" />
                <input type="hidden" name="filter_sortdirection" id="filter_sortdirection" value="<%=filter_sortdirection %>" />

                <div class="container-fluid bg-primary text-white p-1 rounded-2"><i class="bi bi-graph-up-arrow"></i> <%=pageName %></div>

                <div class="container my-2" id="special-filters-div" style="display:block">
                    <div class="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group btn-group-sm" role="group" aria-label="DealSize" id="dealSize_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <div class="btn-group btn-group-sm" role="group" aria-label="MasterPeriod" id="masterPeriod_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <div class="btn-group btn-group-sm" role="group" aria-label="HeaderId" id="headerId_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <button style="display:none" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#filterContainer" aria-expanded="false" aria-controls="filterContainer">...more</button>
                    </div>
                </div>

                <div id="filterContainer" class="collapse">
                    <div class="filters-element justify-content-center"><!--placeholder--></div>
                    <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                            <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                            <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                    </div>
                </div>
            </form>

            <div class="container text-center my-2">
                <div class="row">
                    <span id="MasterPeriod" class="bg-success text-white fw-bold p-2"></span>
                </div>
                <!--TCV-->
                <div class="row mt-1">
                    <div class="col-1 d-flex justify-content-center align-items-center bg-light forecast-measure">
                        <p class="fs-1 fw-bolder text-secondary">TCV</p>
                    </div>

                    <div class="col-11">
                        <div class="row">
                            <div class="col forecast-table">
                                <h5><span class="CurrentHeaderDate">Current</span> Forecast</h5>
                                <table class="table table-sm small" id="tbl_Current_TCV">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                            <div class="col forecast-table">
                                <h5><span class="PriorHeaderDate">Prior</span> Forecast</h5>
                                <table class="table table-sm small" id="tbl_Prior_TCV">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                            <div class="col forecast-table">
                                <h5>Delta</h5>
                                <table class="table table-sm small" id="tbl_Delta_TCV">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                        </div>

                    </div>

                </div>

                <!--IQR-->
                <div class="row mt-3">
                    <div class="col-1 d-flex justify-content-center align-items-center bg-light forecast-measure">
                        <p class="fs-1 fw-bolder text-secondary">IQR</p>
                    </div>

                    <div class="col-11">
                        <div class="row">
                            <div class="col forecast-table">
                                <h5><span class="CurrentHeaderDate">Current</span> Forecast</h5>
                                <table class="table table-sm small" id="tbl_Current_IQR">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                            <div class="col forecast-table">
                                <h5><span class="PriorHeaderDate">Prior</span> Forecast</h5>
                                <table class="table table-sm small" id="tbl_Prior_IQR">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                            <div class="col forecast-table">
                                <h5>Delta</h5>
                                <table class="table table-sm small" id="tbl_Delta_IQR">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                        </div>
                    </div>
                    

                </div>

                <!--IYR-->
                <div class="row mt-3">
                    <div class="col-1 d-flex justify-content-center align-items-center bg-light forecast-measure">
                        <p class="fs-1 fw-bolder text-secondary">IYR</p>
                    </div>

                    <div class="col-11">
                        <div class="row">
                            <div class="col forecast-table">
                                <h5><span class="CurrentHeaderDate">Current</span> Forecast</h5>
                                <table class="table table-sm small" id="tbl_Current_IYR">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                            <div class="col forecast-table">
                                <h5><span class="PriorHeaderDate">Prior</span> Forecast</h5>
                                <table class="table table-sm small" id="tbl_Prior_IYR">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                            <div class="col forecast-table">
                                <h5>Delta</h5>
                                <table class="table table-sm small" id="tbl_Delta_IYR">
                                    <thead class="table-primary">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Won</th>
                                            <th scope="col">In FC</th>
                                            <th scope="col">&gt;5m</th>
                                            <th scope="col">&lt;5m</th>
                                            <th scope="col">Rest</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Best<br />Case</th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>

                                    <tfoot></tfoot>

                                </table>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
            
            <input type="hidden" id="MasterPeriodValue" value="<%=MasterPeriod %>" />
            <input type="hidden" id="DealSizeValue" value="" />

            <div class="modal" id="modal" >
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content p-3">
                        <!--content placeholder-->    
                    </div>
                </div>
            </div>

        </main>
    
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>

    <script type="module" src="default.js" defer></script>
</body>
</html>