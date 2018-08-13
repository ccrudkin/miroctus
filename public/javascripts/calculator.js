$(document).ready(() => {
    updateInput(0);
    inputHandler();
});

function inputHandler() {
    let q = 0;
    document.getElementById('calcInputButton').addEventListener('click', () => {
        let input = document.getElementById('calcInput').value;
        if (validateInput(input)) {
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
            if (validateInput(input)) {
                userResponses[q] = input;
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
            let years = parseInt(userResponses[1] - userResponses[0]);
            let i = parseInt(userResponses[2]);
            let a = parseInt(userResponses[3] * 12);
            let r = parseInt(riskReturn[userResponses[7]]);
            let nestEgg = totalGrowth(years, i, a, r);
            document.getElementById('resultsField').innerHTML = 'Your balance at retirement: $' + Math.round(nestEgg);
            $("#resultsField").fadeIn();
            console.log(userResponses);
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
        return true;
    } else {
        return false;
    }
}

const inputs = {
    0: "Enter your current age:",
    1: "At what age do you want to retire?",
    2: "How much would you invest initially?",
    3: "How much are you willing to save per month?",
    4: "What is a rough estimate of your annual income?",
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