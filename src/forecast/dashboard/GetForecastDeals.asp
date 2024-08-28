<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    Set conn = Server.CreateObject("ADODB.Connection")
    conn.Open(SQ01_STRING)

    Set cmd = Server.CreateObject("ADODB.Command")
    cmd.ActiveConnection = conn
    cmd.CommandText = "ForecastDashboard_View"
    cmd.CommandType = 4 'adCmdStoredProc

    cmd.Parameters("@username") = loginName

    For ix = 1 To Request.Form.Count
        strKey = Request.Form.Key(ix)
        strValue = Replace(Replace(Request.Form.Item(ix),"&#39;","''"), "&#34;", "")

        'Limit to valid keys only (shares filter logic with the parent page thus would be passed more parameters than the SQL expects)
        If ( _
            strKey = "filter_header_id" or _
            strKey = "filter_masterPeriod" or _
            strKey = "filter_forecastWeek" or _
            strKey = "filter_region" or _
            strKey = "filter_measure" or _
            strKey = "filter_columnIndex" or _
            strKey = "filter_dealSize" _
            ) and strValue <> "" Then

                strFieldName = "@" & strKey
                cmd.Parameters(strFieldName) = strValue
        
        End if
    Next

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open cmd, , adOpenForwardOnly, adLockReadOnly

    If Not rs.EOF Then 
        Do While Not rs.EOF
            Response.Write(rs.Fields(0).value)
            rs.MoveNext()
        Loop
    End If

    rs.Close
    Set rs = Nothing
    Set cmd = Nothing
    conn.Close
    Set conn = Nothing
%>
