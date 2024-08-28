<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<!--#include virtual="/lib/ssi/functions.asp" -->
<%
    menuitem_id = 267
    pageName = "SFDC - DXC"

    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "SalesforceDxc"
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
                    <div class="container p-1 col-sm-12 text-white bg-primary rounded-2"><i class="fas fa-list"></i> <%=pageName %> [updated every Tuesday]</div>
                    <div class="container p-1 col-sm-12">
                        <div class="filters-element justify-content-center"><!--placeholder--></div>
                    </div>
                    <div class="container col-sm-2">
                        <div class="buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                            <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="fas fa-search"> search</i></button>
                            <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="fas fa-cut"> reset</i></button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="container-fluid bg-light">
            <div class="row p-1">
                <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Results - same permissions as Security Account Reporting Portal</div>
                <div class="results-element container-fluid p-1 table-responsive">
                    <table id="results-table" class="table table-striped table-light table-hover">
                        <thead>
                            <tr>
                                <th scope="col" id="sort_OpportunityId" data-label="OpportunityId">ID</th>
                                <th scope="col" id="sort_ClientId" data-label="ClientId">ClientId</th>
                                <th scope="col" id="sort_AccountName" data-label="AccountName">Account</th>
                                <th scope="col" id="sort_Region" data-label="Region">Region</th>
                                <th scope="col" id="sort_SubRegion1" data-label="SubRegion1">Sub-region</th>
                                <th scope="col" id="sort_OpportunityName" data-label="OpportunityName">Opportunity</th>
                                <th scope="col" id="sort_OwnerName" data-label="OwnerName">Owner</th>
                                <th scope="col" id="sort_ForecastCategory" data-label="ForecastCategory">Category</th>
                                <th scope="col" id="sort_MasterPeriod" data-label="MasterPeriod">Quarter</th>
                                <th scope="col" id="sort_DealTCV" class="text-end" data-label="DealTCV">Deal $TCV</th>
                                <th scope="col" id="sort_SecurityTCV" class="text-end" data-label="SecurityTCV">Sec $TCV</th>
                                <th scope="col" id="sort_SecurityIYR" class="text-end" data-label="SecurityIYR">Sec $IYR</th>
                            </tr>
                        </thead>

                        <%
                        If rs.EOF Then
                        %>
                            <tbody class="results-none">
                                <tr>
                                        <th scope="row" colspan="11">No records found</th>
                                    </tr>
                            </tbody>
                        <%
                        Else
                        %>

                            <tbody class="results-body">
                                <%
                                For i=1 To rs.RecordCount
	                                If Not rs.EOF Then 
                                        OwnerHtml = ""   
                                        OwnerInitials = GetInitials(rs("OwnerName"))
                                        TitleText = "Owner: " & rs("OwnerName")

                                        If OwnerInitials <> "" Then 
                                            OwnerHtml = "<i class='bi bi-person text-secondary' title='" & TitleText & "'>" & OwnerInitials & "</i>"
                                        End If
                                        %>
                                        <tr id="<%=rs("id") %>">
                                            <th scope="row"><%=rs("OpportunityId") %></th>
                                            <td><%=rs("ClientId") %></td>
                                            <td><%=rs("AccountName") %></td>
                                            <td><%=rs("Region") %></td>
                                            <td><%=rs("Subregion1") %></td>
                                            <td><%=rs("OpportunityName") %></td>
                                            <td><%=OwnerHtml %></td>
                                            <td><%=rs("ForecastCategoryConsolidatedCode")%></td>
                                            <td><%=rs("MasterPeriod")%></td>
                                            <td class="text-end"><%=FormatNumber(rs("DealTCV"), 0)%></td>
                                            <td class="text-end"><%=FormatNumber(rs("SecurityTCV"),0)%></td>
                                            <td class="text-end"><%=FormatNumber(rs("SecurityIYR"),0)%></td>
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
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content p-3">
      
                    <!--grab content from the view-->
                    <!--populate the view with fetched json-->
                               
                    <div class="modal-footer">
                        <button class="">SAVE</button>
                    </div>
                </div>
            </div>
        </div>

    </main>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>

    
    <script type="module" src="default.js"></script>
</body>
</html>
