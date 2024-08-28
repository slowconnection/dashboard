<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 288
    pageName = "Met Demand Tracker"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "MetDemandTracker"
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

                <div class="container-fluid bg-success text-white p-1 rounded-2"><i class="bi bi-people"></i> <%=pageName %></div>
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>
                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>
            </form>

            <div class="container-fluid bg-light">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Results</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_AskDate" data-label="AskDate" class="col-md-0">Ask</th>
                                    <th scope="col" id="sort_PositionId" data-label="PositionId" class="col-md-0">Pos ID</th>
                                    <th scope="col" id="sort_PositionName" data-label="PositionName" class="text-nowrap">Position</th>
                                    <th scope="col" id="sort_AccountName" data-label="AccountName" class="text-nowrap">Client</th>
                                    <th scope="col" id="sort_StartDate" data-label="StartDate" class="col-md-0 text-nowrap">Start</th>
                                    <th scope="col" id="sort_FinishDate" data-label="FinishDate" class="col-md-0 text-nowrap">End</th>
                                    <th scope="col" id="sort_AssignToDate" data-label="AssignToDate" class="col-md-0 text-nowrap">Assign To</th>
                                    <th scope="col" id="sort_Opportunity" data-label="Opportunity" class="text-nowrap">SFDC</th>
                                    <th scope="col" id="sort_DemandContact" data-label="DemandContact" class="text-nowrap">Demand Contact</th>
                                    <th scope="col" id="sort_HasRev" data-label="HasRev" class="text-nowrap">Sec Rev</th>
                                    <th scope="col" id="sort_CapabilityLead" data-label="CapabilityLead" class="text-nowrap">Capability Lead</th>
                                    <th scope="col" id="sort_Comments" data-label="Comments" class="text-nowrap">Comments</th>
                                    <th scope="col" id="sort_FTE" class="col_FTE" data-label="FTE" title="<% =MonthName(Month(Now())) %>">0</th>
                                    <th scope="col" id="sort_FTE1" class="col_FTE" data-label="FTE1" title="<% =MonthName(Month(DateAdd("m",1,Now()))) %>">1</th>
                                    <th scope="col" id="sort_FTE2" class="col_FTE" data-label="FTE2" title="<% =MonthName(Month(DateAdd("m",2,Now()))) %>">2</th>
                                    <th scope="col" id="sort_FTE3" class="col_FTE" data-label="FTE3" title="<% =MonthName(Month(DateAdd("m",3,Now()))) %>">3</th>
                                    <th scope="col" id="sort_FTE4" class="col_FTE" data-label="FTE4" title="<% =MonthName(Month(DateAdd("m",4,Now()))) %>">4</th>
                                    <th scope="col" id="sort_FTE5" class="col_FTE" data-label="FTE5" title="<% =MonthName(Month(DateAdd("m",5,Now()))) %>">5</th>
                                    <th scope="col" id="sort_FTE6" class="col_FTE" data-label="FTE6" title="<% =MonthName(Month(DateAdd("m",6,Now()))) %>">6</th>
                                    <th scope="col" id="sort_FTE7" class="col_FTE" data-label="FTE7" title="<% =MonthName(Month(DateAdd("m",7,Now()))) %>">7</th>
                                    <th scope="col" id="sort_FTE8" class="col_FTE" data-label="FTE8" title="<% =MonthName(Month(DateAdd("m",8,Now()))) %>">8</th>
                                    <th scope="col" id="sort_FTE9" class="col_FTE" data-label="FTE9" title="<% =MonthName(Month(DateAdd("m",9,Now()))) %>">9</th>
                                    <th scope="col" id="sort_FTE10" class="col_FTE" data-label="FTE10" title="<% =MonthName(Month(DateAdd("m",10,Now()))) %>">10</th>
                                    <th scope="col" id="sort_FTE11" class="col_FTE" data-label="FTE11" title="<% =MonthName(Month(DateAdd("m",11,Now()))) %>">11</th>
                                </tr>
                            </thead>

                            <%
                            If rs.EOF Then
                            %>
                                <tbody class="results-none">
                                    <tr>
                                            <th scope="row" colspan="23">No records found</th>
                                        </tr>
                                </tbody>
                            <%
                            Else
                            %>
                                <tbody class="results-body">
                                    <%
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            CommentHtml = ""
                                        
                                            If rs("positionComment") <> "" Then
                                                CommentHtml = "<i class='far fa-clipboard' title='PPM COMMENTS" & chr(13) & chr(10) & rs("PositionComment") & "'></i>&nbsp;"
                                            End If

                                            If rs("hiringComments") <> "" Then
                                                CommentHtml = CommentHtml & "<i class='far fa-clipboard text-primary' title='SECURITY COMMENTS" & chr(13) & chr(10) & rs("hiringComments") & "'></i>"
                                            End If

                                            AccountNameCss = ""
                                            AccountNameTitle = ""
                                            If rs("accountOverride") <> "" Then 
                                                AccountNameCss = " text-primary"
                                                AccountNameTitle = " title='" & "PPM Account Name (" & rs("ppm_accountName") & ") overridden'"
                                            End If
                                            %>
                                            <tr id="<%=rs("Id") %>">
                                                <th scope="row"><%=FormatDateTime(rs("askDate"),vbShortDate) %></th>
                                                <td class="text-nowrap"><%=rs("id") %></td>
                                                <td class="text-nowrap"><%=rs("positionName") %></td>
                                                <td class="text-nowrap<%=AccountNameCss %>" <%=AccountNameTitle %>><%=rs("accountName") %></td>
                                                <td class="text-nowrap"><%=FormatDateTime(rs("startDate"),vbShortDate) %></td>
                                                <td class="text-nowrap"><%=FormatDateTime(rs("finishDate"),vbShortDate) %></td>
                                                <td class="text-nowrap"><%=FormatDateTime(rs("assignFinishDate"),vbShortDate) %></td>
                                                <td class="text-nowrap"><%=Replace(rs("opportunityId"),"#@#",",") %></td>
                                                <td class="text-nowrap"><%=rs("demandContact") %></td>
                                                <td class="text-nowrap"><%=rs("hasSecurityRev") %></td>
                                                <td class="text-nowrap text-primary"><%=rs("capabilityLead") %></td>
                                                <td class="text-nowrap"><%=CommentHtml %></td>

                                                <td class="col_FTE" data-value="<%=rs("m0") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m1") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m2") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m3") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m4") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m5") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m6") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m7") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m8") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m9") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m10") %>"></td>
                                                <td class="col_FTE" data-value="<%=rs("m11") %>"></td>
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
            </!--div>
      
            <div class="modal" id="modal" >
                <div class="modal-dialog modal-dialog-centered">
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
