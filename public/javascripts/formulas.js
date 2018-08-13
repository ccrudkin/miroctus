const riskReturn = {
    1: 0.0451,
    2: 0.0596,
    3: 0.0886,
    4: 0.0981,
    5: 0.1048
};

function annualGrowth(i, a, r) {
    let yearEnd = (i + a) * (1 + r);
    return yearEnd;
}

function totalGrowth(years, i, a, r) {
    console.log(`Years: ${years}\n
                Initial investment: ${i}\n
                Annual additions: ${a}\n
                Growth rate: ${r}`); // debugging
    for (let j = 0; j < years; j++) {
        console.log(`Year ${j} -- Total: $${i}`); // debugging
        i = annualGrowth(i, a, r);
    }
    console.log(Math.round((i * 100) / 100));
    return i;
}