<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 297
    pageName = "Timesheets"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "Timesheet"
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
                <input type="hidden" name="filter_showUserContent" id="filter_showUserContent" value="<%=filter_showUserContent %>" />

                <div class="container-fluid bg-success text-white p-1 rounded-2"><i class="bi bi-bag-check"></i> <%=pageName %></div>

                <div class="container text-center my-2">
                    <div class="row">
                        <div class="col-4"></div>
                        <div class="col">
                            <div class="card" id="outline_employees">
                                <div class="card-body">
                                    <h6 class="card-title">Employees</h6>
                                    <div id="total_employees" class="bg-secondary text-light w-100 p-1">-</div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_accounts">
                                <div class="card-body">
                                    <h6 class="card-title">Accounts</h6>
                                    <div id="total_accounts" class="bg-secondary text-light w-100 p-1">-</div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card" id="outline_hours">
                                <div class="card-body">
                                    <h6 class="card-title">Hours</h6>
                                    <div id="total_hours" class="bg-secondary text-light w-100 p-1">-</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-4"></div>
                    </div>
                    
                </div>  

                <div class="filters-element justify-content-center"><!--placeholder--></div>

                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>

            </form>

            <div class="container-fluid bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Timesheet Data</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_ActivityMonth" data-label="ActivityMonth" class="col-md-0">Month</th>
                                    <th scope="col" id="sort_ClientId" data-label="ClientId" class="col-md-0">Client ID</th>
                                    <th scope="col" id="sort_AccountName" data-label="AccountName" class="col-md-0">Account</th>
                                    <th scope="col" id="sort_EID" data-label="EID" class="col-md-0">EID</th>
                                    <th scope="col" id="sort_EmployeeName" data-label="EmployeeName" class="col-md-0">Employee</th>
                                    <th scope="col" id="sort_RevRegion" data-label="RevRegion" class="col-md-0">P&L Region</th>
                                    <th scope="col" id="sort_Capability" data-label="Capability" class="col-md-0">Capability</th>
                                    <th scope="col" id="sort_PostingObject" data-label="PostingObject" class="col-md-0">Posting</th>
                                    <th scope="col" id="sort_Receiver" data-label="Receiver" class="col-md-0">Receiver</th>
                                    <th scope="col" id="sort_OpportunityId" data-label="OpportunityId" class="col-md-0">Opportunity</th>
                                    <th scope="col" id="sort_AA" data-label="AA" class="col-md-0">AA</th>
                                    <th scope="col" id="sort_KPI" data-label="KPI" class="col-md-0">KPI</th>
                                    <th scope="col" id="sort_Hours" data-label="Hours" class="col-md-0">Hours</th>
                                    <td></td>
                                   
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
                                            If rs("client_id") = 32767 Then 
                                                ClientId = "-"
                                            Else
                                                ClientId = rs("client_id")
                                            End If

                                            DetailHtml = "<i class='bi bi-calendar-week text-danger' title='We are NOT capturing detailed daily timesheet'></i>"
                                            If rs("flgHasDetail") = 1 Then DetailHtml = "<i class='bi bi-calendar-week text-success' title='We are capturing detailed daily timesheet'></i>"

                                            %>
                                            <tr id="<%=rs("id") %>">
                                                <td><%=rs("Activity_Month") %></td>
                                                <td><%=ClientId %></td>
                                                <td><%=rs("customer_name") %></td>
                                                <td><%=rs("EID") %></td>
                                                <td><%=rs("EmployeeName") %></td>
                                                <td><%=rs("revRegion") %></td>
                                                <td><%=rs("capabilityStub") %></td>
                                                <td><%=rs("Posting_Object_ID") %></td>
                                                <td><%=rs("Receiver_Final_CO") %></td>
                                                <td><%=rs("opportunity_id") %></td>
                                                <td><%=rs("AA_Type_Code") %></td>
                                                <td><%=rs("kpiCode") %></td>
                                                <td><%=rs("Actual_Time_H") %></td>
                                                <td><%=DetailHtml %></td>
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

    <script type="module" src="default.js"></script>
</body>
</html>
