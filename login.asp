<!--#include virtual="/lib/connections/sq01.asp" -->
<%
flgRequested = False

keyid = Replace(Request.Cookies("ess")("keyid"), "'", "")
linkid = Replace(Request.Querystring("lk"), "'", "")
emailaddress = Replace(Request.Form("emailaddress"), "'", "")

Set Conn = Server.CreateObject("ADODB.Connection")
Conn.Open(SQ01_STRING)


'If keyid or lk passed as parameters
If linkid <> "" or keyid <> "" Then
    
    'keyid = Request.Cookies("ess")("keyid") 
    flgActivated = -1

    Set Cmd = Server.CreateObject("ADODB.Command")
    Cmd.ActiveConnection = Conn
    Cmd.CommandText = "dbo.getCookie"
    Cmd.CommandType = 4 'adCmdStoredProc

    ' Filters
    Cmd.Parameters("@keyid") = keyid
    Cmd.Parameters("@linkid") = linkid

    Set Recordset = Cmd.Execute()
    If Not Recordset.EOF Then 
        keyid = Recordset("keyid")
        username = Recordset("username")
        emailaddress = Recordset("emailaddress")
        hpid = Recordset("HPID")
        flgActivated = Recordset("flgActivated")
    End If
    Recordset.Close
    Set Recordset = Nothing
    Set Cmd = Nothing
    

    If flgActivated <> -1 Then
        If flgActivated = 0 Then
            Response.Cookies("ess").Expires = dateadd("D", 365, Date())
            Response.Cookies("ess").Secure = True
            Response.Cookies("ess").Domain = "svcs.entsvcs.net"
            Response.Cookies("ess")("keyid") = keyid
            Response.Cookies("ess")("hpid") = hpid
            Response.Cookies("ess")("ntuser") = username
            Response.Cookies("ess")("email") = emailaddress
            Response.Redirect("default.asp")
        Else
            If Request.Cookies("ess")("keyid") = keyid And _
                Request.Cookies("ess")("hpid") = hpid And _
                Request.Cookies("ess")("ntuser") = username Then 
            
                Response.Redirect("default.asp")
            End If
        End If
    End If

Else
    
    If emailaddress <> "" Then
        If len(emailaddress) > 10 And Instr(emailaddress, "@") <> 0 Then
            Set Cmd = Server.CreateObject("ADODB.Command")
            Cmd.ActiveConnection = Conn
            Cmd.CommandText = "dbo.ADMIN_GenerateKey"
            Cmd.CommandType = 4 'adCmdStoredProc

            ' Filters
            Cmd.Parameters("@emailaddress") = emailaddress
            Cmd.Execute()

            Set Cmd = Nothing
        
            flgRequested = True    

        End If

    End If

End If


Set Conn = Nothing
%>
<!DOCTYPE html>
<html lang="en-gb">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>Security Reports System</title>
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
            <div class="container-fluid bg-danger text-white p-1 rounded-2"><i class="bi bi-question-octagon"></i> Unrecognised User</div>

            <div class="container-sm bg-light pt-3">
                <div class="row p-1">
                    <div class="results-element container-sm p-1">
                        <form method="post" action="login.asp">
                            <div class="form-group row">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-8">
                                    <h4>The Security Reports System has been unable to identify you as a valid user.</h4>
                                    <p>For existing users it is likely that you require a new login email.  Please input your corporate email address below.</p>
                                </div>
                                <div class="col-sm-2"></div>
                            </div>

                            <div class="form-group row m-4">
                                <%If flgRequested Then %>
                                    <div class="col-sm-12 text-success text-center"><h5>A login request has been submitted</h5></div>
                                <%Else %>
                                    <div class="col-sm-4"></div>

                                    <div class="col-sm-4">
                                        <div class="input-group mb-3">
                                            <label for="emailaddress" class="input-group-text" id="basic-addon1">Email</label>
                                            <input type="text" class="form-control" id="emailaddress" name="emailaddress" placeholder="" aria-label="" aria-describedby="basic-addon1">
                                        </div>
                                    
                                    </div>

                                    <div class="col-sm-4"><input type="submit" value="Request"/></div>
                                <%End If %>
                            </div>

                            <div class="form-group row">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-8">
                                    <p>If the system recognises the supplied email address, a new login email will be issued (from ess.reports@dxc.com) within the next 15 minutes.  
                                    <u>Login emails are only issued to employees who have already been granted access</u>.</p>
                                    <p class="mb-0 fw-bold">Please contact <a href="mailto:andrew.johnson5@dxc.com" class="link-primary">andrew.johnson5@dxc.com</a> to discuss access requirements if you;</p>
                                    <ul class="fw-bold">
                                        <li>are a new user who needs access, or</li>
                                        <li>have not received an email from ess.reports@dxc.com after 15 minutes, or</li>
                                        <li>have received notification of revoked access and need it reinstating</li>
                                    </ul>
                                </div>
                                <div class="col-sm-2"></div>
                            </div>
                            
                         
                        </form>
                    </div>
                </div>
            </div>
            
        </main>

        </div>

    </body>
</html>
