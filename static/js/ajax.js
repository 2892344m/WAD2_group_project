$(document).ready(function() {
    //Gets pages CSRF token
    function getCSRFToken() {
        return $("input[name=csrfmiddlewaretoken]").val();
    }
    
    const URL = window.location.pathname;

    $('#change_name').click(function() {
        let forename = prompt('Please enter your first name');
        let surname = prompt('Please enter your surname');
        let userid = $(this).attr('data-userid');

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

    //Adds views to product
    if (URL.indexOf("/shop/view_product/") >= 0) {
        let prod_id = $('#product-data').attr('product-id')
        $.ajax({
            url: "/shop/add_views/",
            type: "POST",
            data: {
                csrfmiddlewaretoken: getCSRFToken(),
                prod_id: prod_id
            },
            failure: function(data) {
                alert('Error');
            } 
        })
    }

});