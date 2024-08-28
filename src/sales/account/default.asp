<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 298
    pageName = "Account Tracker"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "AccountTracker"
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
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title><%=pageName %></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" crossorigin="anonymous">
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

                <div class="container-fluid bg-primary text-white p-1 rounded-2"><i class="bi bi-card-checklist"></i> <%=pageName %></div>

                <div >
                    <div class="filters-element justify-content-center"><!--placeholder--></div>
                    <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                            <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                            <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                    </div>
                </div>
            </form>

            <div class="container-fluid bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Results</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_ChangeDate" data-label="ChangeDate" class="col-md-0">Updated</th>
                                    <th scope="col" id="sort_FY" data-label="FY" class="col-md-0">FY</th>
                                    <th scope="col" id="sort_ClientId" data-label="ClientId" class="col-md-0">Client</th>
                                    <th scope="col" id="sort_AccountName" data-label="AccountName" class="col-md-0">Account</th>
                                    <th scope="col" id="sort_Region" data-label="Region" class="col-md-0">Region</th>
                                    <th scope="col" id="sort_SubRegion" data-label="Subregion" class="col-md-0">Subregion</th>
                                    <th scope="col" id="sort_RAG" data-label="RAG" class="col-md-0">RAG</th>
                                    <th scope="col" id="sort_sdlName" data-label="sdlName" class="col-md-0">SDL</th>

                                    <th scope="col" id="sort_RevForecast" data-label="RevForecast" class="col-md-0 text-end">Rev FC</th>
                                    <th scope="col" id="sort_TcvForecast" data-label="TcvForecast" class="col-md-0 text-end">TCV FC</th>
                                    <th scope="col" id="sort_TcvPipeline" data-label="TcvPipeline" class="col-md-0 text-end">TCV Pipe</th>
                                    
                                </tr>
                            </thead>
                            
                            <tbody class="results-body">
                                <%
                                If rs.EOF Then
                                    %>
                                    <tr>
                                        <th scope="row" colspan="11">No records found</th>
                                    </tr>
                                    <%
                                Else

                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            ChangeUserText = ""
                                            If rs("changeuser") <> "" Then ChangeUserText = "Updated by " & rs("changeuserFullname") & " on " & rs("changedate")
                                            RagHTML = DisplayRAG("Operations", rs("operationsRAG")) & _
                                                        DisplayRAG("Growth", rs("growthRAG")) & _
                                                        DisplayRAG("Finance", rs("financeRAG")) & _
                                                        DisplayRAG("Focus", rs("focusRAG")) & _
                                                        DisplayRAG("Warnings", rs("warningsRAG"))

                                            %>
                                            <tr id="<%=rs("id") %>">
                                                <td title="<%=ChangeUserText %>"><%=rs("changedate") %></td>
                                                <td><%=rs("fy") %></td>
                                                <td><%=rs("client_id") %></td>
                                                <td><%=rs("AccountName") %></td>
                                                <td><%=rs("Region") %></td>
                                                <td><%=rs("SubRegion") %></td>
                                                <td><%=RagHTML %></td>
                                                <td><%=rs("sdlName") %></td>
                                                <td class="r"><%=FormatNumber(rs("revForecastCurrentFY"), 0) %></td>
                                                <td class="r"><%=FormatNumber(rs("tcvForecast"), 0) %></td>
                                                <td class="r"><%=FormatNumber(rs("tcvPipeline"), 0) %></td>
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
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content p-3">
                        <!--content placeholder-->    
                    </div>
                </div>
            </div>

            <div class="modal" id="modalRelated" data-bs-backdrop="static" style="z-index:1063">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="titleRelated">Drilldown title</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div><div class="container"></div>
                        <div class="modal-body" id="drilldownRelated">
                            This will contain drilldown data relating to the selected button for the Client and Region/Sub-region combination
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>

        </main>
    
    </div>
    
    <script src="/lib/scripts/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
    <script type="module" src="default.js" defer></script>
    <%
        Function DisplayRAG(text, RAG)
            Dim openHtml
            Dim closeHtml
            closeHtml = "</span>"
            Select Case RAG
                Case "R"
                    openHtml = "<span class='trackerRag bg-danger text-white p-1 mx-1'>"
                Case "A"
                    openHtml = "<span class='trackerRag bg-warning p-1 mx-1'>"
                Case "G"
                    openHtml = "<span class='trackerRag bg-success text-white p-1 mx-1'>"
                Case "B"
                    openHtml = "<span class='trackerRag bg-dark text-white p-1 mx-1'>"
                Case Else
                    openHtml = "<span class='trackerRag bg-light text-secondary p-1 mx-1'>"
            End Select

            DisplayRAG = openHtml & text & closeHtml
        End Function
     %>
</body>
</html>
