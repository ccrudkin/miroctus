function atRetirement() {
    let years = parseFloat(userData[1] - userData[0]);
    let i = parseFloat(userData[2]);
    let a = parseFloat(userData[3] * 12);
    let r = parseFloat(riskReturn[userData[7]]);
    let nestEgg = totalGrowth(years, i, a, r);;

    return nestEgg;
}

function throughRetirement(nestEgg) {
    let years = parseFloat(userData[1] - userData[0]);
    let retireLength = parseFloat(85 - userData[1]);
    let salary = parseFloat(userData[4]);
    let income = parseFloat(salary * .925 - userData[3] * 12);
    let retireEnd = totalWithDraw(years, retireLength, nestEgg, salary, income, riskReturn[3]);
    userData.ssBen = SSben(userData[1], 0, salary);
    let annualAmounts = retireEnd.annualAmounts;

    return annualAmounts;
}

let nestEgg = atRetirement();

drawGrowthBar(userData[0], nestEgg.annualAmounts.concat(throughRetirement(nestEgg.totalGrowth)));