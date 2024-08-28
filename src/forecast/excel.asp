<%
    Response.ContentType = "application/vnd.ms-excel"
    Response.AddHeader "content-disposition", "attachment;  filename=ExcelForecast.xls"
%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%    
    menuitem_id = 282

    On Error Resume Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    cmd.CommandText = "Forecast"
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
        <th>Opp ID</th>
        <th>Account</th>
        <th>Opportunity</th>
        <th>Owner</th>
        <th>Seller</th>
        <th>Master Period</th>
        <th>Category</th>
        <th>Sales Stage</th>


        <th>Deal TCV</th>
        <th>Sec TCV</th>
        <th>Sec IYR</th>
        <th>Sec IQR</th>
    </tr>
    <%
    Do Until rs.EOF
    %>
        <tr>
           <td><%=rs("OpportunityId") %></td>
            <td><%=rs("AccountName") %></td>
            <td><%=rs("OpportunityName") %></td>
            <td><%=rs("OwnerName") %></td>
            <td><%=rs("SecuritySellerName") %></td>
            <td><%=rs("MasterPeriod") %></td>
            <td><%=rs("ForecastCategory") %></td>
            <td><%=rs("SalesStage") %></td>
                                                
            <td><%=rs("DealTCV") %></td>
            <td><%=rs("SecurityTCV") %></td>
            <td><%=rs("SecurityIYR") %></td>
            <td><%=rs("SecurityIQR") %></td>
        </tr>  
        <%
        rs.MoveNext
    Loop
    rs.Close
    Set rs = Nothing
    %>
    <tfoot>
        <tr>
            <td colspan="12"><%=Request.Count %></td>
        </tr>
    </tfoot>
</table>

