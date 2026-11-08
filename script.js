document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.right = '5%';
            navLinks.style.background = 'var(--card-bg)';
            navLinks.style.padding = '1rem';
            navLinks.style.borderRadius = '8px';
            navLinks.style.border = '1px solid var(--border)';
        }
    });

    // Contact Form Handling
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Simulate form submission (replace with actual backend/Formspree later)
        setTimeout(() => {
            btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
            btn.style.background = '#27C93F'; // Green success
            form.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--accent)';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .project-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});