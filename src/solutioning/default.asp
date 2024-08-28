<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<!--#include virtual="/lib/ssi/functions.asp" -->
<%
    menuitem_id = 280
    pageName = "Solutioning Dashboard"
    filter_page = 1 'overridden by any posted value

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "Solutioning"
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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
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
                       
                <div class="filters-element justify-content-center"><!--placeholder--></div>

                <div class="row">
                    <div class="col-4"></div>
                    <div class="col-2">
                        <div class="container col-sm-2 btn-group btn-group-sm" role="group" aria-label="">
                            <button id="toggle-1" type="button" class="btn toggle-button">My</button>
                            <button id="toggle-0" type="button" class="btn toggle-button">All</button>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="btn-group" role="group" aria-label="Buttons">
                            <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                            <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                        </div>
                    </div>
                    <div class="col-4"></div>
                </div>
                <!--
                <div class="container col-sm-2 buttons-element justify-content-center btn-group" role="group" aria-label="Buttons">
                        <button type="submit" id="search-button" class="btn btn-primary btn-sm"><i class="bi bi-search"> search</i></button>
                        <button type="reset" id="reset-button" class="btn btn-secondary btn-sm"><i class="bi bi-arrow-repeat"> reset</i></button>
                </div>
                -->
            </form>

            <div class="container-fluid bg-light pt-3">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Opportunities</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" id="sort_OpportunityId" data-label="OpportunityId" class="col-md-0">Opp ID</th>
                                    <th scope="col" id="sort_AccountName" data-label="AccountName" class="col-md-0">Account</th>
                                    <th scope="col" id="sort_OpportunityName" data-label="OpportunityName" class="col-md-0">Opportunity</th>
                                    <th scope="col" id="sort_OpportunityOwnerName" data-label="OpportunityOwnerName" class="col-md-0">Seller</th>
                                    <th scope="col" id="sort_SLA" data-label="SLA" class="col-md-0">SLA</th>
                                    <th scope="col" id="sort_SRA" data-label="SRA" class="col-md-0">SRA</th>
                                    <th scope="col" id="sort_DarDate" data-label="DarDate" class="col-md-0">DAR</th>
                                    <th scope="col" id="sort_APPR" data-label="APPR" class="col-md-0">APPR</th>
                                    <th scope="col" id="sort_AdviceName" data-label="AdviceName" class="col-md-0">DAR Advice</th>
                                    <th scope="col" id="sort_ForecastCategory" data-label="ForecastCategory" class="col-md-0">Category</th>
                                    <th scope="col" id="sort_SalesStage" data-label="SalesStage" class="col-md-0">Stage</th>
                                    <th scope="col" id="sort_MasterPeriod" data-label="MasterPeriod" class="col-md-0">FQ</th>
                                    <th scope="col" id="sort_DealTCV" data-label="DealTCV" class="col-md-0">Deal TCV</th>
                                    <th scope="col" id="sort_SecurityTCV" data-label="SecurityTCV" class="col-md-0">Sec TCV</th>
                                    <th scope="col" id="sort_Comments" data-label="Comments" class="col-md-0">Comments</th>
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
                                    maxTitleChars = 1000
                                     
                                    For i=1 To rs.RecordCount
	                                    If Not rs.EOF Then 
                                            CommentHtml = ""
                                            
                                            If rs("HighLevelScope") <> "" Then CommentHtml = CommentHtml & "<i class='bi bi-bullseye text-primary' title='OPPORTUNITY SCOPE: " & DisplayTruncated(rs("HighLevelScope"),maxTitleChars) & "'></i>" 
                                            If rs("RisksConcerns") <> "" Then CommentHtml = CommentHtml & "<i class='bi bi-cone-striped text-primary' title='RISKS/CONCERNS: " & DisplayTruncated(rs("RisksConcerns"),maxTitleChars) & "'></i>" 
                                            If rs("SecurityScope") <> "" Then CommentHtml = CommentHtml & "<i class='bi bi-safe text-primary' title='SECURITY SCOPE: " & DisplayTruncated(rs("SecurityScope"),maxTitleChars) & "'></i>" 
                                            If rs("InternalStatus") <> "" Then CommentHtml = CommentHtml & "<i class='bi bi-file-text text-primary' title='STATUS UPDATES: " & DisplayTruncated(rs("InternalStatus"),maxTitleChars) & "'></i>"
                                        
                                            SellerHtml = ""
                                            SellerInitials = GetInitials(rs("OpportunityOwnerName"))
                                            If SellerInitials <> "" Then SellerHtml = "<i class='bi bi-person text-success' title='Seller: " & rs("OpportunityOwnerName") & "'>" & SellerInitials & "</i>"

                                            SlaHtml = ""
                                            SlaInitials = GetInitials(rs("SLA"))
                                            If SlaInitials <> "" Then SlaHtml = "<i class='bi bi-person text-primary' title='SLA: " & rs("SLA") & "'>" & SlaInitials & "</i>"
                                        
                                            SraHtml = ""
                                            SraInitials = GetInitials(rs("SRA"))
                                            If SraInitials <> "" Then SraHtml = "<i class='bi bi-person' title='SRA: " & rs("SRA") & "'>" & SraInitials & "</i>"

                                            ApprHtml = ""
                                            ApprInitials = GetInitials(rs("APPR"))
                                            If ApprInitials <> "" Then ApprHtml = "<i class='bi bi-person text-danger' title='DAR Approver: " & rs("APPR") & "'>" & ApprInitials & "</i>"

                                            %>
                                            <tr id="<%=rs("id") %>">
                                                <td><%=rs("OpportunityID") %></td>
                                                <td class="AccountName"><%=rs("AccountName") %></td>
                                                <td class="OpportunityName"><%=rs("OpportunityName") %></td>
                                                <td><%=SellerHtml %></td>
                                                <td><%=SlaHtml %></td>
                                                <td><%=SraHtml %></td>
                                                <td><%=rs("DarDate") %></td>
                                                <td><%=ApprHtml %></td>
                                                <td><%=rs("AdviceName") %></td>
                                                <td><%=rs("ForecastCategory") %></td>
                                                <td><%=rs("SalesStageStub") %></td>
                                                <td><%=rs("MasterPeriod") %></td>
                                                <td class="r"><%=FormatNumber(rs("DealTCV"),2) %></td>
                                                <td class="r"><%=FormatNumber(rs("SecurityTCV"),2) %></td>
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
