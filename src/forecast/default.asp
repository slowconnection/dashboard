<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<!--#include virtual="/lib/ssi/functions.asp" -->
<%
    menuitem_id = 282
    pageName = "Forecast"
    filter_page = 1 'overridden by any posted value
    MasterPeriod = ""

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "Forecast"
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
        If strKey = "filter_masterPeriod" Then MasterPeriod = strValue
       
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

                <div class="container text-center my-2">
                    <div class="row">
                        <div class="col">
                            <div class="card" id="outline_won">
                                <div class="card-body">
                                    <h6 class="card-title">Won</h6>
                                    <a id="total_won" href="#" class="btn btn-success forecast-totals">-</a>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_in_forecast">
                                <div class="card-body">
                                    <h6 class="card-title">In Forecast</h6>
                                    <a id="total_in_forecast" href="#" class="btn btn-success forecast-totals">-</a>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_over_5m">
                                <div class="card-body pb-1">
                                    <h6 class="card-title">Over $5M</h6>
                                    <a id="total_over_5m" href="#" class="btn btn-warning forecast-totals">-</a>
                                </div>
                                <span id="overall_total_over_5m" class="text-secondary fw-lighter fs-6">-</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_under_5m">
                                <div class="card-body pb-1">
                                    <h6 class="card-title">Under $5M</h6>
                                    <a id="total_under_5m" href="#" class="btn btn-warning forecast-totals">-</a>
                                </div>
                                <span id="overall_total_under_5m" class="text-secondary fw-lighter fs-6">-</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_rest">
                                <div class="card-body pb-1">
                                    <h6 class="card-title">Rest</h6>
                                    <a id="total_rest" href="#" class="btn btn-warning forecast-totals">-</a>
                                </div>
                                <span id="overall_total_rest" class="text-secondary fw-lighter fs-6">-</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_not_counted">
                                <div class="card-body pb-1">
                                    <h6 class="card-title">Not Counted</h6>
                                    <a id="total_not_counted" href="#" class="btn btn-secondary forecast-totals">-</a>
                                </div>
                                <span id="overall_total_not_counted" class="text-secondary fw-lighter fs-6">-</span>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card bg-light" id="outline_forecast">
                                <div class="card-body pb-1">
                                    <h6 class="card-title">TOTAL</h6>
                                    <a id="total_forecast" href="#" class="btn btn-dark forecast-totals">-</a>
                                </div>
                                <span id="overall_total_forecast" class="text-secondary fw-lighter fs-6">-</span>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card bg-light" id="outline_bestcase">
                                <div class="card-body">
                                    <h6 class="card-title">Best Case</h6>
                                    <a id="total_bestcase" href="#" class="btn btn-primary forecast-totals">-</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container my-2" id="special-filters-div" style="display:block">
                    <div class="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group btn-group-sm" role="group" aria-label="Account Group" id="accountGroup_id_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <div class="btn-group btn-group-sm" role="group" aria-label="Region" id="region_id_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <div class="btn-group btn-group-sm" role="group" aria-label="MasterPeriod" id="masterPeriod_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <div class="btn-group btn-group-sm" role="group" aria-label="HeaderId" id="headerId_buttons"><!--placeholder--></div>
                        &nbsp;&nbsp;
                        <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#filterContainer" aria-expanded="false" aria-controls="filterContainer">...more</button>
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

            

            <div class="container-fluid bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 rounded-2" id="resultsHeader"><!--placeholder--></div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_OpportunityId" data-label="OpportunityId" class="col-md-0">Opp ID</th>
                                    <th scope="col" id="sort_AccountName" data-label="AccountName" class="col-md-0 w-25">Account</th>
                                    <th scope="col" id="sort_OpportunityName" data-label="OpportunityName" class="col-md-0 w-25">Opportunity</th>
                                    <th scope="col" id="sort_OwnerName" data-label="OwnerName" class="col-md-0">Owner</th>
                                    <th scope="col" id="sort_SecuritySellerName" data-label="SecuritySellerName" class="col-md-0">Seller</th>
                                    <th scope="col" id="sort_MasterPeriod" data-label="MasterPeriod" class="col-md-0">Master Period</th>
                                    <th scope="col" id="sort_ForecastCategory" data-label="ForecastCategory" class="col-md-0">Category</th>
                                    <th scope="col" id="sort_SalesStage" data-label="SalesStage" class="col-md-0">Sales Stage</th>


                                    <th scope="col" id="sort_DealTCV" data-label="DealTCV" class="col-md-0 text-end">Deal TCV</th>
                                    <th scope="col" id="sort_SecurityTCV" data-label="SecurityTCV" class="col-md-0 text-end">Sec TCV</th>
                                    <th scope="col" id="sort_SecurityIYR" data-label="SecurityIYR" class="col-md-0 text-end">Sec IYR</th>
                                    <th scope="col" id="sort_SecurityIQR" data-label="SecurityIQR" class="col-md-0 text-end">Sec IQR</th>

                                    <th scope="col" id="sort_UpsideDecision" data-label="UpsideDecision" class="col-md-0 text-end">Judgement</th>
                                    
                                </tr>
                            </thead>

                            <%
                            If rs.EOF Then
                            %>
                                <tbody class="results-none">
                                    <tr>
                                        <th scope="row" colspan="13">No records found</th>
                                    </tr>
                                </tbody>
                            <%
                            Else
                            %>
                                <tbody class="results-body">
                                    <%
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                        
                                            If i = 1 then MasterPeriod = rs("MasterPeriod")

                                            UpsideDecision = rs("UpsideDecision")
                                            IconsHtml = ""
                                            If UpsideDecision = "Y" Then IconsHtml = "&nbsp;<i class='bi bi-check-circle-fill text-success' title='Upside (Yes)'></i>"
                                            If UpsideDecision = "N" Then IconsHtml = "&nbsp;<i class='bi bi-x-circle-fill text-danger' title='Upside (No)'></i>"
                                            If UpsideDecision = "B" Then IconsHtml = "&nbsp;<i class='bi bi-briefcase-fill text-primary' title='Upside (Best Case)'></i>"
                                           
                                            PointOfContact = rs("PointOfContact")
                                            If Not(IsNull(PointOfContact)) Then IconsHtml = IconsHtml & "&nbsp;<i class='bi bi-person text-secondary' title='Point of Contact: " & PointOfContact & "'></i>"

                                            LastContactDateSQL = rs("LastContactDate")
                                            If Not(IsNull(LastContactDateSQL)) Then 
                                                LastContactDateVB = FormatDateTime(LastContactDateSQL, vbLongDate)
                                                IconsHtml = IconsHtml & "&nbsp;<i class='bi bi-calendar-event text-secondary' title='Last Contact: " & LastContactDateVB & "'></i>"
                                            End If

                                            CompellingEvent = rs("CompellingEvent")
                                            If Not(IsNull(CompellingEvent)) Then IconsHtml = IconsHtml & "&nbsp;<i class='bi bi-card-text text-secondary' title='Compelling Event: " & CompellingEvent & "'></i>"

                                            MasterPeriodClass = ""
                                            If rs("MasterPeriodOverrideFlag") = "Y" Then MasterPeriodClass="text-primary"

                                            SecurityTcvClass = ""
                                            If rs("SecurityTcvOverrideFlag") = "Y" Then SecurityTcvClass = " text-primary"

                                            SecurityIyrClass = ""
                                            If rs("SecurityIyrOverrideFlag") = "Y" Then SecurityIyrClass = " text-primary"

                                            SecurityIqrClass = ""
                                            If rs("SecurityIqrOverrideFlag") = "Y" Then SecurityIqrClass = " text-primary"

                                            OwnerHtml = ""   
                                            OwnerInitials = GetInitials(rs("OwnerName"))
                                            CreatedTimestamp = rs("CreatedTimestamp")
                                            LastModifiedTimestamp = rs("LastModifiedTimestamp")
                                            TitleText = "Owner: " & rs("OwnerName") & _
                                                chr(13) & "Created: " & CreatedTimestamp & _
                                                chr(13) & "Updated: " & LastModifiedTimestamp

                                            If OwnerInitials <> "" Then 
                                                OwnerHtml = "<i class='bi bi-person text-secondary' title='" & TitleText & "'>" & OwnerInitials & "</i>"
                                            End If

                                            SellerHtml = ""   
                                            SellerInitials = GetInitials(rs("SecuritySellerName"))
                                            SellerText = "Seller: " & rs("SecuritySellerName")

                                            If SellerInitials <> "" Then 
                                                SellerHtml = "<i class='bi bi-person text-info' title='" & SellerText & "'>" & SellerInitials & "</i>"
                                            End If

                                            ConfidenceHtml = ""
                                            LevelOfConfidence = rs("LevelOfConfidence")
                                            If LevelOfConfidence <> "" Then
                                                ConfidenceIcon = "bi-thermometer text-secondary"
                                                If LevelOfConfidence = "High" Then ConfidenceIcon = "bi-brightness-high-fill text-success"
                                                If LevelOfConfidence = "Medium" Then ConfidenceIcon = "bi-brightness-high-fill text-warning"
                                                If LevelOfConfidence = "Low" Then ConfidenceIcon = "bi-brightness-high-fill text-danger"

                                                ConfidenceHtml = " <i class='bi " & ConfidenceIcon & "' title='Confidence: " & LevelOfConfidence & "'></i>"
                                            End If
                                            %>
                                            <tr id="<%=rs("id") %>">
                                                <td><%=rs("OpportunityId") %></td>
                                                <td><%=rs("AccountName") %></td>
                                                <td><%=rs("OpportunityName") %></td>
                                                <td><%=OwnerHtml %></td>
                                                <td><%=SellerHtml %></td>
                                                <td class="text-center <%=MasterPeriodClass %>"><%=rs("MasterPeriod") %></td>
                                                <td><%=rs("ForecastCategory") %><%=ConfidenceHtml %></td>
                                                <td><%=rs("SalesStage") %></td>
                                                
                                                <td class="r"><%=FormatNumber(rs("DealTCV"),2) %></td>
                                                <td class="r<%=SecurityTcvClass %>"><%=FormatNumber(rs("SecurityTCV"),2) %></td>
                                                <td class="r<%=SecurityIyrClass %>"><%=FormatNumber(rs("SecurityIYR"),2) %></td>
                                                <td class="r<%=SecurityIqrClass %>"><%=FormatNumber(rs("SecurityIQR"),2) %></td>

                                                <td class="text-start"><%=IconsHtml %></td>
                                            </tr>
                                            <%
                                            rs.MoveNext
                                        End If
                                    Next
                                    %>
                                </tbody>
                            <%
                            End If
                            rs.Close
                            %>
                        </table>
                        <input type="hidden" id="MasterPeriodValue" value="<%=MasterPeriod %>" />
                    </div>

                    <nav aria-label="...">
                        <div class="results-count"></div>
                        <ul class="pagination pagination-sm justify-content-center">
                            <!--content placeholder-->
                        </ul>
                    </nav>
                </div>
            </div>
      
            <div class="modal" id="modal" >
                <div class="modal-dialog modal-dialog-centered modal-lg">
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
