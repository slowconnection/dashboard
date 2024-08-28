<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 278
    pageName = "Security KPI Data Capture Interface"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "KPI"
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
                <input type="hidden" id="filter_month" name="filter_month" value="" />

                <div class="container-fluid bg-primary text-white p-1 rounded-2"><i class="bi bi-graph-up-arrow"></i> <%=pageName %>
                    <div class="bg-light text-danger w-100">The KPI user interface is now retired - but will remain visible until the end of FY24.  It has been replaced by new tooling (with effect Nov-23).  Please liaise with <a href="mailto:philipv.varughese@dxc.com, ashokkumar.malyala@dxc.com?subject=KPI">Philip Varughese/Ashok Malyala</a> for access to this new tooling.</div>
                </div>
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>
                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>
            </form>

            <div class="container-md bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Questions</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_QuestionRow" data-label="QuestionRow" class="col-md-0">#</th>
                                    <th scope="col" id="sort_CapabilityStub" data-label="CapabilityStub" class="col-md-0">Capability</th>
                                    <th scope="col" id="sort_QuestionName" data-label="QuestionName" class="col-md-0">Question</th>
                                    <th scope="col" id="sort_ma" data-label="ma" class="col-md-0 monthHeader"></th>
                                    <th scope="col" id="sort_mb" data-label="mb" class="col-md-0 monthHeader"></th>
                                    <th scope="col" id="sort_mc" data-label="mc" class="col-md-0 monthHeader"></th>
                                    <th scope="col" id="sort_md" data-label="md" class="col-md-0 monthHeader"></th>
                                    <th scope="col" id="sort_me" data-label="me" class="col-md-0 monthHeader"></th>
                                    <th scope="col" id="sort_mf" data-label="mf" class="col-md-0 monthHeader highlight"></th>
                                    <th scope="col" id="sort_Sparkline" data-label="Sparkline" class="col-md-0 trendHeader">Trend</th>
                                    <th scope="col" id="sort_Comments" data-label="Comments" class="text-nowrap commentsHeader highlight">Comments</th>
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
                                            QuestionNameSource = ""
                                            If rs("cntUserSources") > 1 Then QuestionNameSource = " " & rs("SourceName")

                                            CommentHtml = ""
                                            If rs("mf_comments") <> "" Then CommentHtml = "<i class='bi bi-clipboard-fill text-primary' title='COMMENTS" & chr(13) & chr(10) & replace(rs("mf_comments"),"'","&#39;") & "'></i>&nbsp;"
                                            %>
                                            <tr id="<%=rs("mf_id") %>">
                                                <td><%=rs("QuestionRow") %></td>
                                                <td class="text-center"><%=rs("CapabilityStub") %></td>
                                                <td class="text-nowrap"><%=rs("QuestionName") %><span class="text-primary"><%=QuestionNameSource %></span></td>
                                                <td class="r answerValue"><%=FormatNumber(rs("ma"),0) %></td>
                                                <td class="r answerValue"><%=FormatNumber(rs("mb"),0) %></td>
                                                <td class="r answerValue"><%=FormatNumber(rs("mc"),0) %></td>
                                                <td class="r answerValue"><%=FormatNumber(rs("md"),0) %></td>
                                                <td class="r answerValue"><%=FormatNumber(rs("me"),0) %></td>
                                                <td class="r answerValue highlight"><%=FormatNumber(rs("mf"),0) %></td>
                                                <td class="sparkline trendCell" id="<%=rs("mf_id") %>_sparkline"></td>
                                                <td class="text-nowrap commentsCell highlight"><%=CommentHtml %></td>
                                                
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>

    <script type="module" src="default.js"></script>
</body>
</html>
