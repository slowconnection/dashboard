<% Response.Buffer = True%>
<!--#include virtual="/lib/connections/sq01.asp" -->
<!--#include virtual="/lib/common/auth.asp" -->
<%
    menuitem_id = 263
    pageName = "Account Reporting Dashboard"

    filter_page = 1 'overridden by any posted value

    On Error Resume Next
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title><%=pageName %></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css" integrity="sha384-eoTu3+HydHRBIjnCVwsFyCpUDZHZSFKEJD0mc3ZqSBSb6YhZzRHeiomAUWCstIWo" crossorigin="anonymous">
    <link href="/lib/css/styles.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />
    <link href="/lib/css/dashboardstyles.css?t=<%=css_cache %>" rel="stylesheet" media="all" type="text/css" />

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

    <!--Load the AJAX API-->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

</head>

<body>
    <input type="hidden" id="menuitem_id" value="<%=menuitem_id %>" />
    <input type="hidden" id="httpPost" value="<%=httpPost %>" />
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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

    <main role="main">
        <form method="post" action="default.asp">
            <input type="hidden" name="filter_page" id="filter_page" value="<%=filter_page %>" />
            <input type="hidden" name="filter_sortfield" id="filter_sortfield" value="<%=filter_sortfield %>" />
            <input type="hidden" name="filter_sortdirection" id="filter_sortdirection" value="<%=filter_sortdirection %>" />
            <div class="container-fluid bg-light">
                <div class="row p-1">
                    <div class="container p-1 col-sm-12 text-white bg-primary rounded-2"><i class="fas fa-list"></i> <%=pageName %></div>
                </div>
            </div>
        </form>

        

        <!-- KPI SECTION -->
            <form method="post" action="default.asp">
                <input type="hidden" id="filter_region" name="filter_region" value="<%=filter_region %>" />
                <input type="hidden" id="filter_dashboard" name="filter_dashboard" value="<%=filter_dashboard %>" />
                <input type="hidden" id="filter_year" name="filter_year" value="<%=filter_year %>" />
                <input type="hidden" id="filter_timeframe" name="filter_timeframe" value="<%=filter_timeframe %>" />
                <input type="hidden" id="filter_account" name="filter_account" value="<%=filter_account %>" />

                
            </form>

            <div class="dashboard-container container-fluid">
            <div class="row">
                <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"></div>
                <main class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
                    <div class="dashboard-filter">
                        <div class="account-container">
                            <span class="label">Account:</span>
                            <div class="account-selector" id="account_selector"></div>
                        </div>
                    
                    
                    </div>

                     <!-- KPI SECTION PLACEHOLDER -->
                    <div id="kpi-container" class="kpi-container"></div>

                    <!-- COMPONENTS SECTION PLACEHOLDER -->
                    <div id="components-container" class="components-container">
                        <div class="component" style="width:440px; height:300px">
                            <div class="component-header">HEADER</div>
                            <div class="component-body" style="display:flex; justify-content:center">
                                <div id="chart_div"></div>
                            </div>
                            <div class="component-footer">FOOTER</div>
                        </div>

                        <div class="component" style="width:440px; height:300px">
                            <canvas id="chart1" width="400" height="400"></canvas>
                        </div>
                    </div>

                </main>
           </div>



        </div>

        
        
      
        <div class="modal" id="modal" >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content p-3">
      
                    <!--grab content from the view-->
                    <!--populate the view with fetched json-->
                               
                    <div class="modal-footer">
                        <button class="">SAVE</button>
                    </div>
                </div>
            </div>
        </div>

    </main>
    

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="module" src="./default.js" defer></script>

</body>
</html>
