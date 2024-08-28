<%
    Response.ContentType = "application/vnd.ms-excel"
    Response.AddHeader "content-disposition", "attachment;  filename=ExcelOpenDemand.xls"
%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%    
    menuitem_id = 269

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "OpenDemandTracker"
    cmd.CommandType = adCmdStoredProc
    cmd.NamedParameters = True
    cmd.Parameters("@username") = Server.HTMLEncode(loginName)
    cmd.Parameters("@menuitem_id") = Server.HTMLEncode(menuitem_id)
    cmd.Parameters("@filter_page") = 1
	cmd.Parameters("@filter_pagesize") = 9999

    'iterate querystring
    For Each strKey in Request.QueryString
        strValue = Server.HTMLEncode(Trim(Request.QueryString(strKey)))
        strFieldName = "@" & strKey
        intFieldType = Cmd.Parameters(strFieldName).Type

        If (intFieldValue = 200 Or strValue <> "") and strKey <> "filter_page" and strKey <> "filter_pagesize" Then
            Cmd.Parameters(strFieldName) = strValue
        End If
    Next

    rs.CursorLocation = 3
    rs.Open cmd, , adOpenForwardOnly, adLockReadOnly
%>
<table border="1">
    <tr>
        <th>Ask</th>
        <th>Pos ID</th>
        <th>Position</th>
        <th>Client</th>
        <th>Project</th>
        <th>Country</th>
        <th>Start</th>
        <th>End</th>
        <th>Assign To</th>
        <th>SFDC</th>
        <th>Demand Contact</th>
        <th>Sec Rev</th>
        <th>Capability Lead</th>

        <th>Status</th>
        <th>SubStatus</th>

        <%For mth = 0 to 11
            dt = DateAdd("m",mth,Now())
            strMonth = MonthName(Month(dt))
            strYear = Year(dt)
            %>
            <th><%=Left(strMonth, 3) %>-<%=strYear %></th>
        <%Next %>
    </tr>
    <%
    Do Until rs.EOF
    %>
        <tr>
            <td><%=FormatDateTime(rs("askDate"),vbShortDate) %></td>
            <td><%=rs("id") %></td>
            <td><%=rs("positionName") %></td>
            <td><%=rs("accountName") %></td>
            <td><%=rs("positionProject") %></td>
            <td><%=rs("country") %></td>
            <td><%=FormatDateTime(rs("startDate"),vbShortDate) %></td>
            <td><%=FormatDateTime(rs("finishDate"),vbShortDate) %></td>
            <td><%=FormatDateTime(rs("assignFinishDate"),vbShortDate) %></td>
            <td><%=Replace(rs("opportunityId"),"#@#",",") %></td>
            <td><%=rs("demandContact") %></td>
            <td><%=rs("hasSecurityRev") %></td>
            <td><%=rs("capabilityLead") %></td>

            <td><%=rs("statusCodeDescription") %></td>
            <td><%=rs("subStatus") %></td>

            <td><%=rs("m0") %></td>
            <td><%=rs("m1") %></td>
            <td><%=rs("m2") %></td>
            <td><%=rs("m3") %></td>
            <td><%=rs("m4") %></td>
            <td><%=rs("m5") %></td>
            <td><%=rs("m6") %></td>
            <td><%=rs("m7") %></td>
            <td><%=rs("m8") %></td>
            <td><%=rs("m9") %></td>
            <td><%=rs("m10") %></td>
            <td><%=rs("m11") %></td>
        </tr>  
        <%
        rs.MoveNext
    Loop
    rs.Close
    Set rs = Nothing
    %>
    
</table>

