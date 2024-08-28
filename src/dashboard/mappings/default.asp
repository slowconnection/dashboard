<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 264
    pageName = "Dashboard Account Mappings"

    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "DashboardAccountMappings"
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
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title><%=pageName %></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css" integrity="sha384-eoTu3+HydHRBIjnCVwsFyCpUDZHZSFKEJD0mc3ZqSBSb6YhZzRHeiomAUWCstIWo" crossorigin="anonymous">
    <link href="/lib/css/styles.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />

    <style type="text/css">
        /* ============ desktop view ============ */
        @media all and (min-width: 1280px) {
	        .navbar .nav-item .dropdown-menu{ display: none; }
	        .navbar .nav-item:hover .nav-link{   }
	        .navbar .nav-item:hover .dropdown-menu{ display: block; }
	        .navbar .nav-item .dropdown-menu{ margin-top:0; }
        }	
        /* ============ desktop view .end// ============ */
        </style>
</head>

<body>
    <input type="hidden" id="menuitem_id" value="<%=menuitem_id %>" />
    <input type="hidden" id="httpPost" value="<%=httpPost %>" />
    <input type="hidden" id="recordCount" value="<%=totalRecords %>" />
    <input type="hidden" id="pageCount" value="<%=int(totalRecords / 15) + 1 %>" />
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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

    <main role="main">
        <form method="post" action="default.asp">
            <input type="hidden" name="filter_page" id="filter_page" value="<%=filter_page %>" />
            <input type="hidden" name="filter_sortfield" id="filter_sortfield" value="<%=filter_sortfield %>" />
            <input type="hidden" name="filter_sortdirection" id="filter_sortdirection" value="<%=filter_sortdirection %>" />
            <div class="container-fluid bg-light">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-primary rounded-2"><i class="bi bi-pin-map-fill"></i> <%=pageName %></div>
                    <div class="container p-1 col-sm-12">
                        <div class="filters-element justify-content-center"><!--placeholder--></div>
                    </div>
                    <div class="container col-sm-2">
                        <div class="buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                            <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                            <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="container-xl bg-light">
            <div class="row p-1">
                <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Results</div>
                <div class="results-element container-fluid p-1 table-responsive">
                    <table id="results-table" class="table table-striped table-light table-hover">
                        <thead>
                            <tr>
                                <th scope="col" id="sort_ClientId" data-label="ClientId">ID</th>
                                <th scope="col" id="sort_ClientName" data-label="ClientName">Client</th>
                                <th scope="col" id="sort_Employee" data-label="Employee">Employee</th>
                                <th scope="col" id="sort_RegionList" data-label="RegionList">Region List</th>
                                <th scope="col" id="sort_RevRegion" data-label="RevRegion">Rev Region</th>
                                <th scope="col" id="sort_Capability" data-label="Capability">Capability</th>
                                <th scope="col" id="sort_SubCapability" data-label="SubCapability">Sub-capability</th>
                                <th scope="col" id="sort_LastAccess" data-label="LastAccess">Last Access</th>
                                <th scope="col" id="sort_LoginRemoved" data-label="LoginRemoved">Login Removed</th>
                            </tr>
                        </thead>

                        <%
                        If rs.EOF Then
                        %>
                            <tbody class="results-none">
                                <tr>
                                        <th scope="row" colspan="9">No records found</th>
                                    </tr>
                            </tbody>
                        <%
                        Else
                        %>

                            <tbody class="results-body">
                                <tr id="0" class="table-secondary">
                                    <td colspan="9">ADD</td>
                                </tr>
                                <%
                                For i=1 To rs.RecordCount
	                                If Not rs.EOF Then 
                                        %>
                                        <tr id="<%=rs("id") %>">
                                            <th scope="row"><%=rs("client_id") %></th>
                                            <td><%=rs("customer_name") %></td>
                                            <td><%=rs("fullname") %></td>
                                            <td><%=rs("RegionList")%></td>
                                            <td><%=rs("RevRegion")%></td>
                                            <td><%=rs("ConsultCapability")%></td>
                                            <td><%=rs("SalesTeamName")%></td>
                                            <td><%=FormatDateTime(rs("LastAccess"),vbShortDate) %></td>
                                            <td><%=FormatDateTime(rs("LoginRemoved"),vbShortDate) %></td>
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
                        <!--placeholder-->
                    </ul>
                </nav>
            </div>
        </div>
      
        <div class="modal" id="modal" >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content p-3">
      
                    <!--grab content from the view-->
                    <!--populate the view with fetched json-->
                               
                    <div class="modal-footer">
                        <button type="button" class="">SAVE</button>
                    </div>
                </div>
            </div>
        </div>

    </main>
    

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
    
    <script type="module" src="default.js"></script>
</body>
</html>
