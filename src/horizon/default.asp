<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 282
    pageName = "Horizon"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "Horizon"
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

                <div class="container-fluid bg-primary text-white p-1 rounded-2"><i class="bi bi-bag-check"></i> <%=pageName %></div>
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>
                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>
            </form>

            <div class="container-fluid bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Results: Rate Domains</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_RateDomain" data-label="RateDomain" class="col-md-0">Domain</th>
                                    <th scope="col" id="sort_Scenario" data-label="Scenario" class="col-md-0">Scenario</th>
                                    <th scope="col" id="sort_BusinessType" data-label="BusinessType" class="col-md-0">Business Type</th>

                                    
                                    <th scope="col" id="sort_Revenue" data-label="Revenue" class="col-md-0 text-end">Rev</th>
                                    
                                </tr>
                            </thead>

                            <%
                            If rs.EOF Then
                            %>
                                <tbody class="results-none">
                                    <tr id="0" class="table-secondary">
                                        <td colspan="20">ADD</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" colspan="20">No records found</th>
                                    </tr>
                                </tbody>
                            <%
                            Else
                            %>
                                <tbody class="results-body">
                                    <tr id="0" class="table-secondary">
                                        <td colspan="20">ADD</td>
                                    </tr>
                                    <%
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            %>
                                            <tr id="<%=rs("id") %>">
                                                <td><%=rs("RateDomain") %></td>
                                                <td><%=rs("from_date") %></td>
                                                <td><%=rs("to_date") %></td>
                                                <td><%=rs("currencyCode") %></td>
                                                
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_1"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_2"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_3"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_4"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_5"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_6"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_7"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_8"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_9"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_10"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_11"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_12"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_13"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_14"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_15"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("BillingLevel_16"),2) %></td>
                                                
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
