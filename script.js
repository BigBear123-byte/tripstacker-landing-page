document.addEventListener('DOMContentLoaded', function() {

    const notifyForm = document.getElementById('notify-form');
    const emailInput = document.getElementById('email-input');
    const formMessage = document.getElementById('form-message');

    // --- Your Specific Formspree Endpoint URL ---
    const FORM_ENDPOINT = "https://formspree.io/f/xqapnopd";

    if (notifyForm) {
        notifyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const email = emailInput.value;

            if (email && validateEmail(email)) {
                formMessage.textContent = 'Sending...'; // Indicate processing
                formMessage.className = 'form-message';

                const formData = new FormData(notifyForm);

                fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree & good practice
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Server accepted the submission
                        formMessage.textContent = 'Thank you! We will notify you at launch.';
                        formMessage.className = 'form-message success';
                        emailInput.value = ''; // Clear the input field
                    } else {
                        // Server responded with an error
                        response.json().then(data => { // Try to get error details if available
                            if (data && data.errors) {
                                formMessage.textContent = data.errors.map(error => error.message).join(", ");
                            } else {
                                formMessage.textContent = 'Oops! There was a problem submitting the form.';
                            }
                            formMessage.className = 'form-message error';
                        }).catch(() => { // Fallback if no JSON error details
                            formMessage.textContent = 'Oops! There was a problem submitting the form.';
                            formMessage.className = 'form-message error';
                        });
                    }
                })
                .catch(error => {
                    // Network error or other fetch issue
                    console.error('Form submission error:', error);
                    formMessage.textContent = 'Network error. Please try again.';
                    formMessage.className = 'form-message error';
                });

            } else {
                // Basic client-side validation feedback
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'form-message error';
            }

            // Optional: Clear the error message after a few seconds
             setTimeout(() => {
                 if (formMessage.classList.contains('error')) {
                      formMessage.textContent = '';
                      formMessage.className = 'form-message';
                 }
             }, 5000); // Clear error after 5 seconds

        });
    }

    // Basic email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});