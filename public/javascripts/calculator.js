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
                q += 1; // increment through question list
                updateInput(q);
            } else {
                repromptInput(q);
            }
        }
    });
}

function updateInput(q) {
    if (q > 4) {
        // generate results and display here
        $("#calcForm").fadeOut();
        return;
    } else {
        $('#calcInputLabel').fadeOut(250, () => {
            document.getElementById('calcInputLabel').innerHTML = inputs[q];
            if (q === 4) {
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
    2: "How much would you invest immediately?",
    3: "How much would you add to that investment each month?",
    4: "What percent annual return do you expect? Enter '10' for a realistic starting point."
}

const reprompts = {
    0: "Please enter a valid age.",
    1: "Please enter a valid age of retirement.",
    2: "Please enter a valid dollar amount.",
    3: "Please enter a valid dollar amount.",
    4: "Please enter a valid percentage."
}