$(document).ready(() => {
    updateInput(0);
    inputHandler();
    $('#calcInput').focus(() => {
        setTimeout(() => { document.getElementById('calcInput').scrollIntoView() }, 250);
    });
});

function inputHandler() {
    let q = 0;
    document.getElementById('calcInputButton').addEventListener('click', () => {
        let input = document.getElementById('calcInput').value;
        let cleaned = validateInput(input);
        if (cleaned) {
            userResponses[q] = cleaned;
            q += 1; // increment through question list
            updateInput(q);
        } else {
            repromptInput(q);
        }
    });
    document.getElementById('calcInput').addEventListener('keyup', (event) => {
        let enter = 13;
        if (event.keyCode === enter) {
            let input = document.getElementById('calcInput').value;
            let cleaned = validateInput(input);
            if (cleaned) {
                userResponses[q] = cleaned;
                q += 1; // increment through question list
                updateInput(q);
            } else {
                repromptInput(q);
            }
        }
    });
}

function updateInput(q) {
    if (q >= Object.keys(inputs).length) {
        // generate results and display here
        $("#calcForm").fadeOut(400, () => {
            let p = atRetirement();
            let e = throughRetirement(p);
            toPortfolio(e);
        });
        return;
    } else {
        $('#calcInputLabel').fadeOut(250, () => {
            document.getElementById('calcInputLabel').innerHTML = inputs[q];
            if (q === (Object.keys(inputs).length - 1)) {
                $('#calcInputButton').fadeOut(250, () => {
                    document.getElementById('calcInputButton').innerHTML = 'Finish';
                    $('#calcInputButton').fadeIn(250);
                });
            } else {
                document.getElementById('calcInputButton').innerHTML = 'Next';
            }
            $('#calcInputLabel').fadeIn(250);
            document.getElementById('calcInput').value = '';
        });
        document.getElementById('calcInput').focus();
    }
}

function repromptInput(q) {
    $('#calcInputLabel').fadeOut(250, () => {
        document.getElementById('calcInputLabel').innerHTML = reprompts[q];
        $('#calcInputLabel').fadeIn(250);
    });
}

function validateInput(input) {
    if (input != '') {
        let re = /[$,]+/g;
        let nonDigit = /\D/;
        input = input.replace(re, ''); // search for any $ or , and remove
        if (nonDigit.test(input)) {
            return false;
        } else {
            return input;
        }
    } else {
        return false;
    }
}

function atRetirement() {
    let years = parseFloat(userResponses[1] - userResponses[0]);
    let i = parseFloat(userResponses[2]);
    let a = parseFloat(userResponses[3] * 12);
    let r = parseFloat(riskReturn[userResponses[7]]);
    let nestEgg = totalGrowth(years, i, a, r);
    document.getElementById('resultsField').innerHTML = `<span>Your portfolio at retirement:</span>
                                                        <br>
                                                        <span class="headline">$${Math.round(nestEgg).toLocaleString()}</span>`;
    $(".results").fadeIn();
    // console.log(userResponses);
    return nestEgg;
}

function throughRetirement(nestEgg) {
    let years = parseFloat(userResponses[1] - userResponses[0]);
    let retireLength = parseFloat(85 - userResponses[1]);
    let income = parseFloat(userResponses[4] * .925 - userResponses[3] * 12);
    let retireEnd = totalWithDraw(years, retireLength, nestEgg, income, riskReturn[3]);
    document.getElementById('breakdownField').innerHTML = 
        `<p class="sizeUp">Will that get you through retirement?</p>
        <p>At the end of retirement, you will have:</p>
        <span class="headline">$${Math.round(retireEnd).toLocaleString()}</span>
        <p> 
        <ul class="sizeDown">
            This assumes that you will:
            <li>maintain a standard of living at the future equivalent of $${income.toLocaleString()} per year (annual income minus savings rate)</li>
            <li>live to be 85</li> 
            <li>take inflation into account over your retirement</li>
            <li>move your investment portfolio to a medium-risk allocation in retirement</li>
        </ul>
        </p>`;

    $(".breakdown").fadeIn();
    $(".backgroundFade").fadeIn();
    return retireEnd;
}

function toPortfolio(e) {
    if (e < 0) {
        document.getElementById('toAction').innerHTML = 
        `<p>That's not enough -- check out your summary below.</p>
        <p>But there's good news! We can still help you revise and build a plan to meet your goals.</p>
        <button class="buttons" id="toActionButton">Go</button>`;
    } else {
        document.getElementById('toAction').innerHTML = 
        `<p>That's enough to meet your goal -- check out your summary below.</p>
        <p>Are you ready to make it happen? We can help you build your portfolio.</p>
        <button class="buttons" id="toActionButton">Go</button>`;
    }
    $('#toAction').fadeIn();
    document.getElementById('toActionButton').addEventListener('click', () => {
        toAction(userResponses);
    });
}

function toAction(data) {
    window.location.href = `/portfoliobuilder/${data[0]}/${data[1]}/${data[2]}/${data[3]}/${data[4]}/${data[5]}/${data[6]}/${data[7]}`;
}

const inputs = {
    0: "Enter your current age:",
    1: "At what age do you want to retire?",
    2: "How much would you invest initially?",
    3: "How much are you willing to save and invest per month?",
    4: "What is a rough estimate of your annual income, before taxes?",
    5: "What is a rough estimate of your monthly expenses? (Bills, groceries, mortgage, etc.)",
    6: "What is a rough estimate of your liquid net worth, not including your home?",
    7: "From 1-5, how agressively would you invest? Higher is riskier, but has more growth potential."
};

const reprompts = {
    0: "Please enter a valid age.",
    1: "Please enter a valid age of retirement.",
    2: "Please enter a valid dollar amount.",
    3: "Please enter a valid dollar amount.",
    4: "Please enter a valid dollar amount.",
    5: "Please enter a valid dollar amount.",
    6: "Please enter a valid dollar amount.",
    7: "Please enter a number between 1 and 5."
};

let userResponses = {};