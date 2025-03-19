$(document).ready(function() {
    //Gets pages CSRF token
    function getCSRFToken() {
        return $("input[name=csrfmiddlewaretoken]").val();
    }
    
    const URL = window.location.pathname;

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