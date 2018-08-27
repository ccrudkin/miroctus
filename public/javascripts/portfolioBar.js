function growthChart(userData) {
    function atRetirement() {
        let years = parseFloat(userData.retireAge - userData.age);
        let i = parseFloat(userData.initInvest);
        let a = parseFloat(userData.monthlySave * 12);
        let r = parseFloat(riskReturn[userData.riskWilling]);
        let nestEgg = totalGrowth(years, i, a, r);;
    
        return nestEgg;
    }
    
    function throughRetirement(nestEgg) {
        let years = parseFloat(userData.retireAge - userData.age);
        let retireLength = parseFloat(85 - userData.retireAge);
        let salary = parseFloat(userData.annualIncome);
        let income = parseFloat(salary * .925 - userData.monthlySave * 12);
        let retireEnd = totalWithDraw(years, retireLength, nestEgg, salary, income, riskReturn[3]);
        userData.ssBen = SSben(userData.retireAge, 0, salary);
        let annualAmounts = retireEnd.annualAmounts;
    
        return annualAmounts;
    }
    
    let nestEgg = atRetirement();
    
    drawGrowthBar(userData.age, nestEgg.annualAmounts.concat(throughRetirement(nestEgg.totalGrowth)));
}