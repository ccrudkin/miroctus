$(document).ready(() => {
    updateInput(0);
    inputHandler();
});

function inputHandler() {
    let q = 0;
    document.getElementById('calcInputButton').addEventListener('click', () => {
        q += 1; // increment through question list
        updateInput(q);
    });
    document.getElementById('calcInput').addEventListener('keyup', (event) => {
        let enter = 13;
        if (event.keyCode === enter) {
            q += 1;
            updateInput(q);
        }
    });
}

function updateInput(q) {
    $('#calcInputLabel').fadeOut(250, () => {
        document.getElementById('calcInputLabel').innerHTML = inputs[q];
        if (q >= 4) {
            $('#calcInputButton').fadeOut(250, () => {
                document.getElementById('calcInputButton').innerHTML = 'Finish';
                $('#calcInputButton').fadeIn(250);
            });
        } else {
            document.getElementById('calcInputButton').innerHTML = 'Next';
        }
        $('#calcInputLabel').fadeIn(250);
    });
}

const inputs = {
    0: "Enter your current age:",
    1: "At what age do you want to retire?",
    2: "How much would you invest immediately?",
    3: "How much would you add to that investment each month?",
    4: "What percent annual return do you expect? Enter '10' for a realistic starting point."
}