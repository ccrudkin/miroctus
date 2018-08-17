let userData = JSON.parse(sessionStorage.getItem('investmentProfile'));

const riskRate = {
    0: 'conservative',
    1: 'moderately_conservative',
    2: 'moderate',
    3: 'moderately_aggressive',
    4: 'aggressive'
}

let riskNum = riskRate[userData[7] - 1];

document.getElementById('userProfile').innerHTML = 
    `<span class="sizeUp">Profile:</span>
    <span>Age: ${userData[0]}</span>
    <span>Retirement age: ${userData[1]}</span>
    <span>Initial investment: $${parseFloat(userData[2]).toLocaleString()}</span>
    <span>Monthly savings: $${parseFloat(userData[3]).toLocaleString()}</span>
    <span>Annual income: $${parseFloat(userData[4]).toLocaleString()}</span>
    <span>Monthly expenses: $${parseFloat(userData[5]).toLocaleString()}</span>
    <span>Net worth: $${parseFloat(userData[6]).toLocaleString()}</span>
    <span>Risk willingness: ${userData[7]}</span>`;

function recommendations() {
    $.ajax({
        url: `/portfoliobuilder/${riskNum}`,
        type: 'GET',
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success(data, textStatus, jqXHR) {
            document.getElementById('allocationChart').innerHTML = 
            `<div class="headline">${data.name} Portfolio</div>
            <div class="flexH" id="allocationDetails">
                <!-- <img src="/images/charts/${riskNum}.png" alt="${riskNum} allocation chart"> -->
                <div class="chartContainer">
                    <canvas class='chart' id="chart" width="300" height="300"></canvas>
                </div>
                <span class="flexV">
                    <span style="font-size: 1.15em";>Historical return: ${data.return * 100}% annually</span> 
                    <span>${data.cash[0]}</span>
                    <span>${data.stb[0]}</span>
                    <span>${data.itb[0]}</span>
                    <span>${data.ltb[0]}</span>
                    <span>${data.lcvs[0]}</span>
                    <span>${data.lcgs[0]}</span>
                    <span>${data.mcs[0]}</span>
                    <span>${data.scs[0]}</span>
                    <span>${data.ids[0]}</span>
                    <span>${data.ies[0]}</span>
                </span>
            </div>`;
            drawChart(data);
        }
    });
}

recommendations();