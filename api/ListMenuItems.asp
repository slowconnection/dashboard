<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
Dim currentPageId, cp

currentPageId = 0
'cp = Request.Form("cp")
cp = Request("cp")

If IsNumeric(cp) Then  currentPageId = Cint(cp)

strSQL = "EXEC api.ListMenuItems @username='" & loginName & "'"
If currentPageId <> 0 Then strSQL = strSQL & ", @currentPageId=" & Cstr(currentPageId)

Set c = Server.CreateObject("ADODB.Connection")
c.Open(SQ01_STRING)

Set rs = c.Execute(strSQL)
If Not rs.EOF Then 
    Do While Not rs.EOF
        Response.Write(rs.Fields(0).value)
        rs.MoveNext()
    Loop
End If
rs.Close
Set rs = Nothing
c.close
Set c = Nothing
%>