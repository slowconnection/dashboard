<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 0
    pageName = "Home"
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
    </style>

    <link href="/lib/css/styles.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
</head>

<body>
    <div class="container-fluid p-0">

        <input type="hidden" id="menuitem_id" value="<%=menuitem_id %>" />
        <input type="hidden" id="httpPost" value="" />
        <input type="hidden" id="recordCount" value="" />
        <input type="hidden" id="pageCount" value="" />

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

                <div class="container-fluid bg-success text-white p-1 rounded-2"><i class="bi bi-house-door"></i> <%=pageName %></div>
                       
            </form>

            <div class="container-md bg-light pt-5">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-secondary rounded-2">Overview</div>
                    <div class="results-element container-fluid p-1 table-responsive">
                    
                        <table id="results-table" class="table table-striped table-light table-hover">
                            <thead>
                                <tr class="table-info">
                                    <td colspan="2">This system is presently based upon the following feeds of information</td>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <th>EMPLOYEES</th>
                                    <td>Metadata as maintained by Security employees and cross-referenced against the various feeds to facilitate analysis by various dimensions</td>
                                </tr>
                                <tr>
                                    <th>HORIZON-Actuals</th>
                                    <td>Daily extract of revenue/expense data detailing all 'actuals' logged against SECURITY</td>
                                </tr>
                                <tr>
                                    <th>HORIZON-Budget</th>
                                    <td>Annual extract of revenue/expense data detailing all 'budget' logged against SECURITY</td>
                                </tr>
                                <tr>
                                    <th>HORIZON-Forecast</th>
                                    <td>Daily extract of revenue/expense data detailing all 'current forecast' logged against SECURITY</td>
                                </tr>
                                <tr>
                                    <th>PPMC-Positions</th>
                                    <td>Daily extract of demand data from the PPMC Delivery Database relating to DELIVER-SECURITY resource pools and employees</td>
                                </tr>
                                <tr>
                                    <th>PPMC-Projects</th>
                                    <td>Daily extract of project data from the PPMC Delivery Database relating to SECURITY projects</td>
                                </tr>
                                <tr>
                                    <th>SCHEDULE</th>
                                    <td>Realtime data managed either centrally via user interfance or by individuals via an Excel/Email based process</td>
                                </tr>
                                <tr>
                                    <th>SFDC-DXC</th>
                                    <td>Weekly pipeline extracts that detail the entire DXC pipeline</td>
                                </tr>
                                <tr>
                                    <th>SFDC-Security</th>
                                    <td>Daily extract from SFDC that details all deals involving Security offerings</td>
                                </tr>
                                <tr>
                                    <th>TIMESHEETS</th>
                                    <td>Daily extracts of CATW data detailing everyone linked to known DELIVER-SECURITY cost centres</td>
                                </tr>
                                <tr>
                                    <th>WORKDAY-Headcount</th>
                                    <td>Monthly extracts that details key attributes relating to DELIVER-SECURITY employees</td>
                                </tr>
                                <tr>
                                    <th>WORKDAY-Holidays</th>
                                    <td>Approved holidays for employees reporting into the VP for DELIVER-SECURITY (for autoupdate of the Schedule)</td>
                                </tr>
                            
                            </tbody>

                            <tfoot>
                                <tr class="table-info">
                                    <td colspan="2">From these feeds the Security Reports System supplies a variety of reporting tools and automated HTML emails, Excel dashboards and PowerPoint presentations.</td>
                                </tr>
                                <tr class="table-info">
                                    <td colspan="2">Access to this user interface is granted by exception and depends upon (a) active connection to the corporate VPN and (b) user access privileges being explicitly added.</td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>

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
    <script>
        const config = {
            pageType: 'Basic',
            menuType: 'Standard',
            pagingType: 'Standard'
        }
    </script>
    <script type="module" src="default.js"></script>
</body>
</html>
