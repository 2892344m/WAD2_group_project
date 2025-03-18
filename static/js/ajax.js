$(document).ready(function() {
    //Gets pages CSRF token
    function getCSRFToken() {
        return $("input[name=csrfmiddlewaretoken]").val();
    }

    $('#change_name').click(function() {
        let forename = prompt('Please enter your first name');
        let surname = prompt('Please enter your surname');
        let userid = $(this).attr('data-userid');

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajax({
            url: "/shop/change_name/",
            type: 'POST',
            data: {
                fname: forename,
                sname: surname,
                id: userid,
                csrfmiddlewaretoken: getCSRFToken(),
            },
            success: function(data) {
                window.location.reload();
            },
            failure: function(data) {
                alert('Error');
            }
        });
    });
});