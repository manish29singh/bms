function compareConfirmPass(form) {

    if (form.password.value == form.password2.value) {
        return true
    } else {
        document.getElementById('confirmMsg').innerText = "Password did not matched";
        document.getElementById('confirmMsg').style.color = "red";
        return false
    }
}

function reInvitation() {
    let email = document.getElementById('email').value;
    let name = document.getElementById('name').value;
    let uid = document.getElementById('uid').value;

    $(document).ready(function () {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                "id": uid,
                "email": email,
                "name": name
            },
            url: 'https://localhost:3000/user/re-invite',
            success: function (result) {
                console.log(result);
                $('#re-invite').css("display", 'none');
                console.log(`${uid}name`)
                $(`#${uid}name`).text(name);
                $(`#${uid}email`).text(email);
            },
            error: function (err) {
                alert('error called' + err.message);
            }
        })
    })
}

function toggleStatus(id, status) {
    var sure = confirm('Are you sure?');
    if(sure){
        $(document).ready(function () {
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: {
                    "id": id,
                    "status": status
                },
                url: 'https://localhost:3000/sa/change-status',
                success: function (result) {
                    // $('#'+id).remove();
                },
                error: function (err) {
                    alert('error called' + err);
                }
            })
        })
    }else return false;

}

function deleteUser(id){
    var sure = confirm('Are you sure?');
    if(sure){
        $(document).ready(function () {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: `https://localhost:3000/user/delete-user/${id}`,
                success: function (result) {
                     $('#'+id).remove();
                },
                error: function (err) {
                    alert('error called' + err.message);
                }
            })
        })
    }else return false;

}

function changeTicketStatus(){
    let ticketStatus = $('#ticket-status-select').val();
    let uid = $('#uid').val();
    console.log(uid+ " "+ ticketStatus)
    $(document).ready(function(){
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                id: uid,
                status: ticketStatus
            },
            url: `https://localhost:3000/tickets/ticket-status`,
            success: function (result) {
               console.log(result.status)
               $('#ticket-status').css("display", 'none');
               $(`#${uid}status`).text(result.status);
           },
           error: function (err) {
               alert('error called' + err.message);
           }

        })
    })
}

function deleteTicket(id){
    var sure = confirm('Are you sure?');
    if(sure){
        $(document).ready(function () {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: `https://localhost:3000/tickets/${id}`,
                success: function (result) {
                     $('#'+id).remove();
                },
                error: function (err) {
                    alert('error called' + err.message);
                }
            })
        })
    }else return false;

}
