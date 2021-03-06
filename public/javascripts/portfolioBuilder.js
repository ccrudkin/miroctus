const riskRate = {
    0: 'conservative',
    1: 'moderately_conservative',
    2: 'moderate',
    3: 'moderately_aggressive',
    4: 'aggressive'
}

function getUserData() {
    $.ajax({
        url: '/profile/details',
        type: 'GET',
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success(data, textStatus, jqXHR) {
            let riskNum = riskRate[data.riskWilling - 1];
            recommendations(riskNum);
            growthChart(data);
            console.log(data);
        }
    });
}

function recommendations(riskNum) {
    $.ajax({
        url: `/profile/portfolio/${riskNum}`,
        type: 'GET',
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success(data, textStatus, jqXHR) {
            document.getElementById('allocationChartContainer').innerHTML = 
            `<div class="headline">Your target allocation:<br>${data.name} Portfolio</div>
            <div class="flexH" id="allocationDetails">
                <div class="chartContainer" id="allocationInnerChart">
                    <canvas class="chart" id="allocationChart" width="300" height="300"></canvas>
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

getUserData();

/* // populate user profile data from session; DEPRECATED
document.getElementById('userProfile').innerHTML = 
    `<span class="sizeUp">Profile:</span>
    <span>Age: ${userData[0]}</span>
    <span>Retirement age: ${userData[1]}</span>
    <span>Initial investment: $${parseFloat(userData[2]).toLocaleString()}</span>
    <span>Monthly savings: $${parseFloat(userData[3]).toLocaleString()}</span>
    <span>Annual income: $${parseFloat(userData[4]).toLocaleString()}</span>
    <span>Monthly expenses: $${parseFloat(userData[5]).toLocaleString()}</span>
    <span>Net worth: $${parseFloat(userData[6]).toLocaleString()}</span>
    <span>Risk willingness: ${userData[7]}</span>
    <span>Annual Social Security benefit: $${Math.round(userData.ssBen).toLocaleString()}</span>`;
*/