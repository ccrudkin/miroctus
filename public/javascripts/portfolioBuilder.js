let userData = JSON.parse(sessionStorage.getItem('investmentProfile'));

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

document.getElementById('recPort').innerHTML = 
    ``

/*
<span class="sizeUp">Profile:</span>
<span>Age: <%= userData[0] %></span>
<span>Retirement age: <%= userData[1] %></span>
<span>Initial investment: $<%= userData[2].toLocaleString() %></span>
<span>Monthly savings: $<%= userData[3] %></span>
<span>Annual income: $<%= userData[4] %></span>
<span>Monthly expenses: $<%= userData[5] %></span>
<span>Net worth: $<%= userData[6] %></span>
<span>Risk willingness: <%= userData[7] %></span>
*/