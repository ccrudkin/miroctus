const riskReturn = {
    1: 0.0451,
    2: 0.0596,
    3: 0.0886,
    4: 0.0981,
    5: 0.1048
};

const inflation = .0289;

function annualGrowth(i, a, r) {
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
        // console.log(`Adjusted addition for year ${j}: ${aAdjusted}`);
        i = annualGrowth(i, aAdjusted, r);
    }
    return i;
}