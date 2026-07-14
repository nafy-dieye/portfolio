export function initContactSection() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = 'Merci de remplir tous les champs.';
      status.style.color = 'var(--coral)';
      return;
    }

    status.textContent = 'Envoi en cours…';
    status.style.color = 'var(--paper-dim)';

    try {
      const response = await fetch('https://formspree.io/f/mykrzkkb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      });

      if (response.ok) {
        status.textContent = '✓ Message envoyé avec succès ! Je vous réponds sous 48h.';
        status.style.color = 'var(--teal)';
        form.reset();
        setTimeout(() => {
          status.textContent = '';
        }, 5000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      status.textContent = '✗ Erreur lors de l\'envoi. Essayez directement : dieyeadjanafi@gmail.com';
      status.style.color = 'var(--coral)';
      console.error('Contact form error:', error);
    }
  });
}
