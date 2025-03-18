//JS for countdown and redirecting back to homepage (derived from example on w3school)
$(document).ready(function() {
    if (window.location.pathname == "/accounts/logout/") {
        let countdownTime = 3;
        const countdownElement = document.getElementById('countdown');
    
        const countdownInterval = setInterval(() => {
            countdownTime--;
            countdownElement.textContent = countdownTime;
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                window.location.href = "{% url 'shop:homepage' %}";
            }
        }, 1000);
    }
});