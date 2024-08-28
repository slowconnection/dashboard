"use strict";
import Dashboard from './Dashboard.js';
import Repo from './Repo.js';

document.addEventListener("DOMContentLoaded", async () => {

    const repo = new Repo({});
    const dashboard = new Dashboard({repo});
    
    await dashboard.init();

    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
    ];

    const data = {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const myChart = new Chart(
        document.getElementById('chart1'),
        config
    );



}, { once: true });


