function savePass() {

    let data = `
        oldPassword=${document.getElementById('oldPassword').value}&
        newPassword=${document.getElementById('newPassword').value}&
        newPassword2=${document.getElementById('newPassword2').value}
    `
    // keep the data human-readable above and machine-readable when sent
    let reg = /[\n\s]+/g;
    data = data.replace(reg, '');
    
    $.ajax({
        url: '/account',
        type: 'POST',
        data: data,
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            return 'Error.'
        },
        success(data, textStatus, jqXHR) {
            console.log(`Howdy! Data sent to server. Msg: ${data.msg}`);
            if (data.status === 'success') {
                document.getElementById('savePassMsg').innerHTML = `${data.msg}`;
                formReset();
                $('#savePassMsg').fadeIn();
            } else {
                let errors = '';
                for (let i = 0; i < data.msg.length; i++) {
                    errors += data.msg[i] + '<br>';
                }
                document.getElementById('savePassMsg').innerHTML = 'Error. ' + errors;
                formReset();
                $('#savePassMsg').fadeIn();
            }
        }
    });
}

function formReset() {
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newPassword2').value = '';
}

document.getElementById('savePassButton').addEventListener('click', savePass);