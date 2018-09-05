function resetPass() {

    let data = `
        email=${document.getElementById('email').value}
    `
    // keep the data human-readable above and machine-readable when sent
    let reg = /[\n\s]+/g;
    data = data.replace(reg, '');
    
    $.ajax({
        url: '/account/reset',
        type: 'POST',
        data: data,
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            return 'Error.'
        },
        success(data, textStatus, jqXHR) {
            console.log(`Data sent to server. Msg: ${data.msg}`);
            if (data.status === 'success') {
                document.getElementById('resetPassMsg').innerHTML = `${data.msg}`;
                $('#resetPassMsg').fadeIn();
            } else {
                let errors = '';
                for (let i = 0; i < data.msg.length; i++) {
                    errors += data.msg[i] + '<br>';
                }
                document.getElementById('resetPassMsg').innerHTML = 'Error. ' + errors;
                $('#resetPassMsg').fadeIn();
            }
        }
    });
}

document.getElementById('resetPassButton').addEventListener('click', resetPass);