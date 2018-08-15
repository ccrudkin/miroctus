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
            `<div class="sizeUp">${riskNum.slice(0, 1).toUpperCase() + riskNum.slice(1)} Portfolio</div>
            <div class="flexH" id="allocationDetails">
                <img src="/images/charts/${riskNum}.png" alt="${riskNum} allocation chart">
                <span class="sizeDown flexV" id="allocationDetails">
                    <span>${data.cash}</span>
                    <span>${data.stb}</span>
                    <span>${data.itb}</span>
                    <span>${data.ltb}</span>
                    <span>${data.lcvs}</span>
                    <span>${data.lcgs}</span>
                    <span>${data.mcs}</span>
                    <span>${data.scs}</span>
                    <span>${data.ids}</span>
                    <span>${data.ies}</span>
                </span>
            </div>`;
        }
    });
}

recommendations();