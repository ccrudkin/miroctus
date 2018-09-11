// historical rates of return for given portfolio profiles
const riskReturn = {
    1: 0.0451,
    2: 0.0596,
    3: 0.0886,
    4: 0.0981,
    5: 0.1048
};

const inflation = .0289;

function annualGrowth(i, a, r) { // initial investment, annual addition, growth rate
    let yearEnd = (parseFloat(i) + parseFloat(a)) * (1 + r);
    return yearEnd;
}

function totalGrowth(years, i, a, r) {
    console.log(`Years: ${years}\n` +
                `Initial investment: ${i}\n` +
                `Annual additions: ${a}\n` +
                `Growth rate: ${r}`); // debugging
    let growthData = {};                
    for (let j = 0; j < years; j++) {
        growthData[j] = {};

        // console.log(`Year ${j} start -- Total: $${i}`); // debugging
        growthData[j]['start'] = i;

        let aAdjusted = a * (1 + inflation) ** (j + 1);
        growthData[j]['additions'] = aAdjusted;
        // console.log(`Adjusted addition for year ${j}: ${aAdjusted}`); // debugging

        i = annualGrowth(i, aAdjusted, r);
        growthData[j]['iReturn'] = i - growthData[j]['start'] - aAdjusted;
        // console.log(`Year end amount after addition and growth: ${i}`);

        growthData[j]['end'] = i;
    }
    // console.log(`Growth data object: ${JSON.stringify(growthData, null, ' ')}`);
    return growthData;
}

function withDraw(p, w, r) { // portfolio value, withdrawal rate, growth rate
    let yearEnd = p * (1 + r) - w;
    return yearEnd;
}

function totalWithDraw(iyears, ryears, p, salary, w, r) {
    console.log(`Years of retirement: ${ryears}\nPortfolio size: ${p}\nWithdrawal rate: ${w}\nGrowth rate: ${r}`);
    let annualAmounts = [];
    let withDrawAmounts = [];
    for (let j = 0; j < ryears; j++) {
        console.log(`Year ${j} starting amount: $${p}`); // debugging
        let wAdjusted = w * (1 + inflation) ** (j + iyears);
        withDrawAmounts.push(Math.round(wAdjusted));
        wAdjusted -= SSben(85 - ryears, j, salary);
        console.log(`Year ${j} adjusted withdrawal (with SS): $${wAdjusted}`); // debugging
        p = withDraw(p, wAdjusted, r);
        annualAmounts.push(Math.round(p));
    }
    return { "totalWithDraw": p, "annualAmounts": annualAmounts, "withDrawAmounts": withDrawAmounts };
}

// calculate social security benefit based on retirement age, according to gov't formula
// NOTE: bendPoints change every year; THIS WILL NEED REGULAR UPDATING
function SSben(retirementAge, retirementYear, salary) {
    let bendPoints = [ 895, 5397 ]; // bend points change yearly, so can only estimate
    let aime = salary / 12;
    let pia;
    if (aime <= bendPoints[0]) {
        pia = aime * .9;
    } else if (aime > bendPoints[0] && aime <= bendPoints[1]) {
        pia = (bendPoints[0] * .9) + (aime - bendPoints[0]) * .32;
    } else if (aime > bendPoints[1]) {
        pia = (bendPoints[0] * .9) + ((bendPoints[1] - bendPoints[0]) * .32) + (aime - bendPoints[1]) * .15;
    }
    console.log(`Unadjusted PIA: ${pia}`); // debugging
    if (retirementAge < 67 && retirementAge >= 64) {
        pia = pia * (1 - (.0667 * (67 - retirementAge)));
    } else if (retirementAge < 64) {
        pia = pia * (1 - ((.0667 * 3) + (.05 * (64 - retirementAge))));
    } else if (retirementAge > 67 && retirementAge <= 70) {
        pia = pia * (1 + (retirementAge - 67) * .08);
    } else if (retirementAge > 70) {
        pia = pia * (1 + 3 * .08);
    }
    console.log(`Adjusted PIA: ${pia}`); // debugging
    console.log(`Adjusted PIA with inflation: ${pia * (1 + inflation) ** retirementYear}`)
    return (pia * 12) * (1 + inflation) ** retirementYear;
}

module.exports = {
    riskReturn: riskReturn,
    inflation: inflation,
    annualGrowth: annualGrowth,
    totalGrowth: totalGrowth,
    withDraw: withDraw,
    totalWithDraw: totalWithDraw,
    SSben: SSben      
}