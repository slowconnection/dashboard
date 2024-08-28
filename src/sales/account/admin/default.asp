﻿<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<!--#include virtual="/lib/ssi/functions.asp" -->
<%
    menuitem_id = 302
    filter_page = 1 'overridden by any posted value
    pageName = "Account Tracker Permissions"

    'On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "AccountTrackerPermissions"
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

                <div class="container-fluid bg-secondary text-white p-1 rounded-2"><i class="bi bi-ui-checks-grid"></i> <%=pageName %></div>
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>
                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>
            </form>

            <div class="container-md bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Permissions based upon Region/Portfolio/Client</div>
                    <div class="results-element container-fluid p-1">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_FullName" data-label="FullName" class="col-md-0">Employee</th>
                                    <th scope="col" id="sort_RegionName" data-label="RegionName" class="col-md-0">Region</th>
                                    <th scope="col" id="sort_SubRegionName" data-label="SubRegionName" class="col-md-0">Portfolio</th>
                                    <th scope="col" id="sort_ClientName" data-label="ClientName" class="col-md-0">Client</th>
                                    <th scope="col" id="sort_flgWrite" data-label="flgWrite" class="col-md-0">Access</th>
                                    <th scope="col" id="sort_LastVisit" data-label="LastVisit" class="col-md-0">Visited</th>
                                </tr>
                            </thead>

                            <tbody class="results-body">
                                <tr id="0" class="table-secondary">
                                    <td colspan="6">ADD</td>
                                </tr>
                                <%
                                If Not rs.EOF Then
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            regionClass = ""
                                            subRegionClass = ""
                                            clientClass = ""
                                            visitClass = ""
                                            clientId = Cstr(rs("client_id")) & "&nbsp;"
                                            If rs("regionName") = "(Any)" Then regionClass = " text-danger"
                                            If rs("subRegionName") = "(Any)" Then subRegionClass = " text-danger"
                                            If rs("clientName") = "(Any)" Then 
                                                clientClass = " text-danger"
                                                clientId = ""
                                            End If
                                            If rs("lastVisit") = "(Never)" Then visitClass = " text-danger"
                                            
                                            If rs("flgWrite") = 1 Then
                                                accessHTML = "<i class='bi bi-pencil-square'> Write</i>"
                                            Else
                                                accessHTML = "<i class='bi bi-book-half'> Read</i>"
                                            End If


                                            %>
                                            <tr id="<%=rs("ID") %>">
                                                <td class="text-nowrap"><%=rs("fullname") %></td>
                                                <td class="text-nowrap <%=regionClass %>"><%=rs("regionName") %></td>
                                                <td class="text-nowrap <%=subRegionClass %>"><%=rs("subRegionName") %></td>
                                                <td class="text-nowrap <%=clientClass %>"><%=clientId %><%=rs("clientName") %></td>
                                                <td class="text-nowrap"><%=accessHTML %></td>
                                                <td class="text-nowrap <%=visitClass %>"><%=rs("lastVisit") %></td>
                                            </tr>
                                            <%
                                            rs.MoveNext
                                        End If
                                    Next
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
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content p-3">
                        <!--content placeholder-->    
                    </div>
                </div>
            </div>

        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>

    <script>
        const config = {
            pageType: 'ReadOnly',
            menuType: 'Standard',
            pagingType: 'Standard'
        }
    </script>
    <script type="module" src="./default.js"></script>

   
</body>
</html>