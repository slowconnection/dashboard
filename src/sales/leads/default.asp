<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 292
    pageName = "Leads"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "Leads"
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
        If strKey = "filter_showUserContent" Then filter_showUserContent = strValue
       
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
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
                <input type="hidden" name="filter_showUserContent" id="filter_showUserContent" value="<%=filter_showUserContent %>" />

                <div class="container-fluid bg-dark-subtle text-dark p-1 rounded-2"><i class="bi bi-door-open"></i> <%=pageName %></div>
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>

                <div class="row">
                    <div class="col text-center">
                        <div class="btn-group" role="group" aria-label="Buttons">
                            <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                            <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                        </div>
                    </div>
                </div>
            </form>

            <div class="container-fluid bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Leads</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_DisplayId" data-label="DisplayId" class="col-md-0">ID</th>
                                    <th scope="col" id="sort_RegionName" data-label="RegionName" class="col-md-0">Region</th>
                                    <th scope="col" id="sort_ClientId" data-label="ClientId" class="col-md-0">Client ID</th>
                                    <th scope="col" id="sort_AccountName" data-label="AccountName" class="col-md-0">Account</th>
                                    <th scope="col" id="sort_LeadName" data-label="LeadName" class="col-md-0">Lead Name</th>
                                    <th scope="col" id="sort_OfferingStub" data-label="OfferingStub" class="col-md-0">Offering</th>
                                    <th scope="col" id="sort_ResponsiblePersonName" data-label="ResponsiblePersonName" class="col-md-0">Responsible Person</th>
                                    <th scope="col" id="sort_EstimatedFYFQ" data-label="EstimatedFQFQ" class="col-md-0">Est FYFQ</th>
                                    <th scope="col" id="sort_EstimatedTCV" data-label="EstimatedTCV" class="col-md-0">Est TCV ($K)</th>
                                    <th scope="col" id="sort_OpportunityId" data-label="OpportunityId" class="col-md-0">Opportunity ID</th>
                                    <th scope="col" id="sort_LeadStatusName" data-label="LeadStatusName" class="col-md-0">Status</th>
                                </tr>
                            </thead>

                            <tbody class="results-body">
                                <tr id="0" class="table-secondary">
                                    <td colspan="11">ADD</td>
                                </tr>
                                <%
                                If Not rs.EOF Then
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            sfdcClassName = ""
                                            sfdcTitle = ""

                                            If rs("opportunity_id") <> "" Then
                                                sfdcTitle = rs("sfdc_ForecastCategory") & " " & _
					                                rs("sfdc_MasterPeriod") & " - " & _
                                                    rs("sfdc_SecurityTCV") & " (TCV)   " & _
                                                    rs("sfdc_SecurityIYR") & " (IYR)"

                                                Select Case rs("sfdc_flgOpen")
                                                    Case 1
                                                        'sfdcTitle = "Open"
                                                        sfdcClassName = " class='p-1 bg-secondary text-white'"
                                                    Case 0
                                                        If rs("sfdc_flgForecast") = 1 Then
                                                            'sfdcTitle = "Won"
                                                            sfdcClassName = " class='p-1 bg-success text-white'"
                                                        Else
                                                            'sfdcTitle = "Lost"
                                                            sfdcClassName = " class='p-1 bg-danger text-white'"
                                                        End If
                                                    case Else
                                                        sfdcTitle = "Erroneous ID? Excluded from pipeline? No Security?"
                                                End Select
                                            End If

                                            solutionHtml = ""
                                            If rs("solution") <> "" Then
                                                solutionHtml = "&nbsp;<i class='bi bi-wrench-adjustable text-primary' title='" & rs("solution") & "'></i>"
                                            End If


                                            %>
                                            <tr id="<%=rs("id") %>">
                                                <td><%=rs("displayId") %></td>
                                                <td><%=rs("regionName") %></td>
                                                <td><%=rs("client_id") %></td>
                                                <td class="AccountName"><%=rs("accountName") %></td>
                                                <td><%=rs("leadName") %></td>
                                                <td><%=rs("offeringStub") %> <%=solutionHtml %></td>
                                                <td><%=rs("responsiblePersonName") %></td>
                                                <td><%=rs("estimatedFYFQ") %></td>
                                                <td><%=rs("estimatedTCV") %></td>
                                                <td title="<%=sfdcTitle%>"><span <%=sfdcClassName %>><%=rs("opportunity_id") %></span></td>
                                                <td><%=rs("leadStatusName") %></td>
                                            </tr>
                                            <%
                                            rs.MoveNext
                                        End If
                                    Next
                                    %>
                                
                                <%
                                End If
                                rs.Close
                                %>
                             </tbody>
                        </table>
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>

    <script type="module" src="default.js"></script>
</body>
</html>
