$(document).ready(function() {
    $('#change_name').click(function() {
        // let firstname = prompt('Please enter your first name');
        // let surname = prompt('Please enter your surname');
        // let userid = $(this).attr('data-userid');

        var firstname = "Ah";
        var surname = "Blah";
        var userid = "Hah";

        $.get("/shop/change_name/",
              {'userId': userid,'fname': firstname,'sname': surname},
              function(data) {

              })
    });
});