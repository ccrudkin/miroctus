let userData = JSON.parse(sessionStorage.getItem('investmentProfile'));

if (!userData) {
    window.location.href = '/calculator';
}

$(document).ready(() => {
    let thisYear = 2018; // change to dynamic
    let age = userData[0];
    // calc birth year from data and pre-select with 'selected' attribute
    for (let i = thisYear; i > 1899; i--) {
        if (2018 - age === i) {
            $('#birthYear').append(`<option value="${i}" selected="selected">${i}</option`);
        } else {
            $('#birthYear').append(`<option value="${i}">${i}</option`);
        }
    }

    $('#annualIncome').val('$' + parseFloat(userData[4]).toLocaleString());
    $('#netWorth').val('$' + parseFloat(userData[6]).toLocaleString());
});

function submitData() {

    let data = `
        firstName=${document.getElementById('firstName').value}&
        lastName=${document.getElementById('lastName').value}&
        email=${document.getElementById('email').value}&
        password=${document.getElementById('password').value}&
        password2=${document.getElementById('password2').value}&
        birthYear=${document.getElementById('birthYear').value}&
        annualIncome=${cleanInput(document.getElementById('annualIncome').value)}&
        retireAge=${userData[1]}&
        netWorth=${cleanInput(document.getElementById('netWorth').value)}&
        initInvest=${userData[2]}&
        monthlySave=${userData[3]}&
        monthlyExpenses=${userData[5]}&
        riskWilling=${userData[7]}
    `
    // keep the data human-readable above and machine-readable when sent
    let reg = /[\n\s]+/g;
    data = data.replace(reg, '');
    
    $.ajax({
        url: '/register/createuser',
        type: 'POST',
        data: data, // { data: JSON.stringify(data) },
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            return 'Error.'
        },
        success(data, textStatus, jqXHR) {
            console.log(`Data sent to server. Msg: ${data.msg}`);
            if (data.status === 'success') {
                window.location.href = `/login/success`;
            } else {
                let errors = '';
                for (let i = 0; i < data.msg.length; i++) {
                    errors += data.msg[i] + '<br>';
                }
                document.getElementById('registerError').innerHTML = 'Error. ' + errors;
                $('#registerError').fadeIn();
            }
        }
    });
}

function cleanInput(input) {
    let re = /[$,]+/g;
    input = input.replace(re, ''); // search for any $ or , and remove
    return input;
}

document.getElementById('createProfileButton').addEventListener('click', submitData);