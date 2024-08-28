<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
' Filters
    filterDashboard = request("filterDashboard")


'Get the  recordset
    Set Conn = Server.CreateObject("ADODB.Connection")
    Conn.Open(SQ01_STRING)

    Set Cmd = Server.CreateObject("ADODB.Command")
    Cmd.ActiveConnection = Conn
    Cmd.CommandText = "api.getDashboardComponents"
    Cmd.CommandType = 4 'adCmdStoredProc

    Cmd.Parameters("@username") = loginName
    If filterDashboard <> "" Then Cmd.Parameters("@filterDashboard") = filterDashboard
    
    Set Recordset = Cmd.Execute()
    If Not Recordset.EOF Then 
        Do While Not Recordset.EOF
            Response.Write(Recordset.Fields(0).value)
            Recordset.MoveNext()
        Loop
    End If

'Clean-up
    Recordset.Close
    Set Recordset = Nothing
    Set Cmd = Nothing
    Set Conn = Nothing
%>