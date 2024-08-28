<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
'Get the  recordset
    Set Conn = Server.CreateObject("ADODB.Connection")
    Conn.Open(SQ01_STRING)

    Set Cmd = Server.CreateObject("ADODB.Command")
    Cmd.ActiveConnection = Conn
    Cmd.CommandText = "api.ListAccountSubregions"
    Cmd.CommandType = 4 'adCmdStoredProc

    ' Filters
    Cmd.Parameters("@username") = loginName

    For ix = 1 To Request.Form.Count
        strKey = Request.Form.Key(ix)
        strValue = Server.HTMLEncode(trim(Request.Form.Item(ix)))
        If strValue <> "" Then
            strFieldName = "@" & strKey
            cmd.Parameters(strFieldName) = strValue
        End If
    Next

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