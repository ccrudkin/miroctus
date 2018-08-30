function submitData() {

    let data = `
        firstName=${document.getElementById('firstName').value}&
        lastName=${document.getElementById('lastName').value}&
        birthYear=${document.getElementById('birthYear').value}&
        annualIncome=${cleanInput(document.getElementById('annualIncome').value)}&
        retireAge=${document.getElementById('retireAge').value}&
        netWorth=${cleanInput(document.getElementById('netWorth').value)}&
        initInvest=${cleanInput(document.getElementById('initInvest').value)}&
        monthlySave=${cleanInput(document.getElementById('monthlySave').value)}&
        monthlyExpenses=${cleanInput(document.getElementById('monthlyExpenses').value)}&
        riskWilling=${document.getElementById('riskWilling').value}
    `
    // keep the data human-readable above and machine-readable when sent
    let reg = /[\n\s]+/g;
    data = data.replace(reg, '');
    
    $.ajax({
        url: '/profile/edit',
        type: 'POST',
        data: data,
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            return 'Error.'
        },
        success(data, textStatus, jqXHR) {
            console.log(`Data sent to server. Msg: ${data.msg}`);
            if (data.status === 'success') {
                document.getElementById('updateMessage').innerHTML = `${data.msg}`;
                $('#updateMessage').fadeIn();
            } else {
                let errors = '';
                for (let i = 0; i < data.msg.length; i++) {
                    errors += data.msg[i] + '<br>';
                }
                document.getElementById('updateMessage').innerHTML = 'Error. ' + errors;
                $('#updateMessage').fadeIn();
            }
        }
    });
}

function cleanInput(input) {
    let re = /[$,]+/g;
    input = input.replace(re, ''); // search for any $ or , and remove
    return input;
}

document.getElementById('saveProfileButton').addEventListener('click', submitData);