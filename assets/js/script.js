// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        this.setAttribute('aria-expanded', 
            this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    mobileMenuBtn.click();
                }

                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL hash without triggering scroll
                history.pushState(null, null, targetId);
            }
        });
    });

    // Handle page load and refresh
    window.addEventListener('load', function() {
        // If there's a hash in the URL, smoothly scroll to top
        if (window.location.hash) {
            history.pushState(null, null, '#home');
            // Use the same smooth scrolling method as the scroll-to-top button
            document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth',
                duration: 2000
            });
        }
    });

    // Form Validation and Submission
    const contactForm = document.querySelector('#consultationForm');
    const formResponse = document.querySelector('#formResponse');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const practiceArea = document.getElementById('practice-area').value;
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            let errorMessage = '';

            // Validate name
            if (name.length < 2) {
                isValid = false;
                errorMessage += 'Please enter a valid name.\n';
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }

            // Validate phone (optional but if provided, must be valid)
            if (phone && !/^[0-9+\-\s()]{10,}$/.test(phone)) {
                isValid = false;
                errorMessage += 'Please enter a valid phone number.\n';
            }

            // Validate practice area
            if (!practiceArea) {
                isValid = false;
                errorMessage += 'Please select a practice area.\n';
            }

            // Validate message
            if (message.length < 10) {
                isValid = false;
                errorMessage += 'Please enter a message (minimum 10 characters).\n';
            }

            if (isValid) {
                // Disable submit button and show loading state
                const submitButton = contactForm.querySelector('.submit-button');
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                // Create FormData object
                const formData = new FormData(contactForm);

                // Send AJAX request
                fetch('process_consultation.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Show response message
                    formResponse.style.display = 'block';
                    formResponse.textContent = data.message;
                    formResponse.className = 'form-response ' + (data.success ? 'success' : 'error');

                    if (data.success) {
                        // Reset form on success
                        contactForm.reset();
                    }
                })
                .catch(error => {
                    formResponse.style.display = 'block';
                    formResponse.textContent = 'An error occurred. Please try again later.';
                    formResponse.className = 'form-response error';
                })
                .finally(() => {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                });
            } else {
                formResponse.style.display = 'block';
                formResponse.textContent = errorMessage;
                formResponse.className = 'form-response error';
            }
        });
    }

    // Scroll to Top Button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        document.documentElement.scrollTo({
            top: 0,
            behavior: 'smooth',
            duration: 2000
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scrolling down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scrolling up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add animation to practice area cards
    const practiceCards = document.querySelectorAll('.practice-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    practiceCards.forEach(card => {
        observer.observe(card);
    });

    // Add animation to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        observer.observe(card);
    });

    // Add animation to stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        observer.observe(item);
    });

    // Smooth scroll to About section
    function scrollToAbout() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add click event listener to scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', scrollToAbout);
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToAbout();
            }
        });
    }
}); 
