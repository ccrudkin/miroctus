function drawChart(data) {
    var ctx = document.getElementById("chart");

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    data.cash[2],
                    data.stb[2],
                    data.itb[2],
                    data.ltb[2],
                    data.lcvs[2],
                    data.lcgs[2],
                    data.mcs[2],
                    data.scs[2],
                    data.ids[2],
                    data.ies[2]
                ],
                backgroundColor: [
                    '#F1948A',
                    '#BB8FCE',
                    '#85C1E9',
                    '#73C6B6',
                    '#82E0AA',
                    '#F8C471',
                    '#E59866',
                    '#C39BD3',
                    '#7FB3D5',
                    '#76D7C4'
                ]
            }],
            labels: [
                data.cash[1],
                data.stb[1],
                data.itb[1],
                data.ltb[1],
                data.lcvs[1],
                data.lcgs[1],
                data.mcs[1],
                data.scs[1],
                data.ids[1],
                data.ies[1]
            ]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 10,
                    fontSize: 10
                },
                position: 'bottom'
            }
        }
    });
}
