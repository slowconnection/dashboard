<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 271
    filter_page = 1 'overridden by any posted value
    pageName = "Cost Centres"

    'On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "CostCenter"
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css" integrity="sha384-b6lVK+yci+bfDmaY1u0zE8YYJt0TZxLEAFyYSLHId4xoVvsrQu3INevFKo+Xir8e" crossorigin="anonymous">
    
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
        <input type="hidden" id="pageCount" value="<%=int(totalRecords / 15) + 1 %>" />

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

                <div class="container-fluid bg-success text-white p-1 rounded-2"><i class="bi bi-files"></i> <%=pageName %></div>
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>
                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>
            </form>

            <div class="container-md bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Results</div>
                    <div class="results-element container-fluid p-1">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_CostCenter" data-label="CostCenter" class="col-md-0">CC</th>
                                    <th scope="col" id="sort_LegacyCompany" data-label="LegacyCompany" class="col-md-0">Legacy</th>
                                    <th scope="col" id="sort_RevenueRegion" data-label="RevenueRegion" class="col-md-0">Rev Region</th>
                                    <th scope="col" id="sort_Country" data-label="Country" class="col-md-0">Country</th>
                                    <th scope="col" id="sort_Capability" data-label="Capability" class="col-md-0">Capability</th>
                                    <th scope="col" id="sort_RateDomain" data-label="RateDomain" class="col-md-0">Rates</th>
                                    <th scope="col" id="sort_CntActiveEmployees" data-label="CntActiveEmployees" class="col-md-0">Emp</th>
                                    <th scope="col" id="sort_LatestCatw" data-label="LatestCatw" class="col-md-0">CATW</th>
                                    <th scope="col" id="sort_hrbi_status" data-label="hrbi_status" class="col-md-0">WD</th>
                                </tr>
                            </thead>

                            <%
                            If rs.EOF Then
                            %>
                                <tbody class="results-none">
                                    <tr>
                                            <th scope="row" colspan="4">No records found</th>
                                        </tr>
                                </tbody>
                            <%
                            Else
                            %>
                                <tbody class="results-body">
                                    <%
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            WorkdayHtml = ""
                                            If rs("hrbi_status") = 1 Then WorkdayHtml = "<i class='bi bi-person-fill-check text-success' title='Active in Workday HC'></i>"
                                            If rs("hrbi_status") = 2 Then WorkdayHtml = "<i class='bi bi-person-fill-exclamation text-danger' title='No longer active in Workday HC'></i>"
                                            %>
                                            <tr id="<%=rs("ID") %>">
                                                <td class="text-nowrap"><%=rs("costCenter") %></td>
                                                <td class="text-nowrap"><%=rs("legacyCompany") %></td>
                                                <td class="text-nowrap"><%=rs("revenueRegion") %></td>
                                                <td class="text-nowrap"><%=rs("country") %></td>
                                                <td class="text-nowrap"><%=rs("capabilityStub") %></td>
                                                <td class="text-nowrap"><%=rs("rateDomain") %></td>
                                                <td class="text-nowrap"><%=rs("cntActiveEmployees") %></td>
                                                <td class="text-nowrap"><%=rs("latestCatw") %></td>
                                                <td class="text-nowrap"><%=WorkdayHtml %></td>

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
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content p-3">
                        <!--content placeholder-->    
                    </div>
                </div>
            </div>

        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>

    <script type="module" src="default.js"></script>
</body>
</html>
