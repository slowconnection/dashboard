// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['gauge','corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    const dashboard = new Dashboard;
    dashboard.draw();
   
}


class Dashboard {
    draw() {
        var data = google.visualization.arrayToDataTable([
            ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
                'Western', 'Literature', { role: 'annotation' }],
            ['2010', 10, 24, 20, 32, 18, 5, ''],
            ['2020', 16, 22, 23, 30, 16, 9, ''],
            ['2030', 28, 19, 29, 30, 12, 13, '']
        ]);

        var options = {
            width: 440,
            height: 250,
            legend: null, 
            bar: { groupWidth: '75%' },
            isStacked: true,
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
}