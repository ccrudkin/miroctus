const riskReturn = {
    1: 0.0451,
    2: 0.0596,
    3: 0.0886,
    4: 0.0981,
    5: 0.1048
};

const inflation = .0289;

function annualGrowth(i, a, r) { // initial investment, annual addition, growth rate
    let yearEnd = (i + a) * (1 + r);
    return yearEnd;
}

function totalGrowth(years, i, a, r) {
    console.log(`Years: ${years}\n` +
                `Initial investment: ${i}\n` +
                `Annual additions: ${a}\n` +
                `Growth rate: ${r}`); // debugging
    for (let j = 0; j < years; j++) {
        // console.log(`Year ${j} start -- Total: $${i}`); // debugging
        let aAdjusted = a * (1 + inflation) ** (j + 1);
        // console.log(`Adjusted addition for year ${j}: ${aAdjusted}`); // debugging
        i = annualGrowth(i, aAdjusted, r);
    }
    return i;
}

function withDraw(p, w, r) { // portfolio value, withdrawal rate, growth rate
    let yearEnd = p * (1 + r) - w;
    return yearEnd;
}

function totalWithDraw(iyears, ryears, p, w, r) {
    console.log(`Years of retirement: ${ryears}\nPortfolio size: ${p}\nWithdrawal rate: ${w}\nGrowth rate: ${r}`);
    for (let j = 0; j < ryears; j++) {
        console.log(`Year ${j} starting amount: $${p}`); // debugging
        let wAdjusted = w * (1 + inflation) ** (j + iyears);
        console.log(`Year ${j} adjusted withdrawal: $${wAdjusted}`); // debugging
        p = withDraw(p, wAdjusted, r);
    }
    return p;
}