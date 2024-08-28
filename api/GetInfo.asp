<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    Set conn = Server.CreateObject("ADODB.Connection")
    conn.Open(SQ01_STRING)

    Set cmd = Server.CreateObject("ADODB.Command")
    cmd.ActiveConnection = conn
    cmd.CommandText = "api.GetInfo"
    cmd.CommandType = 4 'adCmdStoredProc

    Cmd.Parameters("@username") = loginName

    For ix = 1 To Request.Form.Count
        strKey = Request.Form.Key(ix)
        strValue = Replace(Replace(Request.Form.Item(ix),"&#39;","''"), "&#34;", "")
        If strValue <> "" Then
            strFieldName = "@" & strKey
            cmd.Parameters(strFieldName) = strValue
        End If
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
