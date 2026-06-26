function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    // Re-render the toggle icon
    lucide.createIcons();
}

function handleLogin(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value.trim();
    const loginCard = document.getElementById('loginCard');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Reset messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    loginCard.classList.remove('shake');

    // Correct credentials database
    const VALID_USERS = {
        'sitthichok': '1234',
        'supichaya': '1234'
    };

    if (VALID_USERS[usernameInput] && VALID_USERS[usernameInput] === passwordInput) {
        // Success logic
        successMessage.classList.add('show');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Save session login flag (for basic client-side check on dashboard)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', usernameInput);

        // Redirect after 1.5s success animation
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        // Failure logic
        // Trigger reflow to restart shake animation
        void loginCard.offsetWidth;
        loginCard.classList.add('shake');
        errorMessage.classList.add('show');
        
        // Focus password input on failure
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

// Check if already logged in and redirect to dashboard
window.onload = () => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
};
