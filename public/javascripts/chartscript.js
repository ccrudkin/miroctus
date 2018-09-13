function drawChart(data) {
    var ctx = document.getElementById("allocationChart");

    var portChart = new Chart(ctx, {
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
                display: false,
                labels: {
                    boxWidth: 10,
                    fontSize: 10
                },
                position: 'bottom'
            },
            title: {
                display: true,
                text: `${data.name} Portfolio`
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let dataset = data.datasets[tooltipItem.datasetIndex];
                        // console.log(dataset);
                        let currentValue = dataset.data[tooltipItem.index];
                        let percentage = Math.round(currentValue * 1000) / 10;
                        let labelText = dataset._meta[1].data[tooltipItem.index]._model.label;
                        return `${labelText}: ${percentage}%`;
                    }
                }
            } 
        }
    });
}

function drawGrowthBar(age, data) {
    var ctx = document.getElementById("growthChart");

    // console.log(data);
    let labels = []; 
    for (let i = 0; i < data.length; i++) {
        labels.push(i + parseInt(age));
    }

    var growthLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(248, 196, 113, .8)'
                ],
                label: [
                    "Portfolio Value ($)"
                ],
                pointRadius: 0,
                pointHitRadius: 10,
                pointBackgroundColor: '#E59866'
            }]
        },
        options: {
            legend: {
                display: true,
                labels: {
                    boxWidth: 10,
                    fontSize: 10
                }
            },
            title: {
                display: true,
                text: 'Projected Portfolio Value'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 10
                    },
                    scaleLabel: {
                        labelString: 'Age',
                        display: true
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
                    }
                }
            } 
        }
    });
}