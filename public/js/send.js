document.getElementById('sendForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file');
    const passwordInput = document.getElementById('password');
    const submitButton = e.target.querySelector('button[type="submit"]');

    if (!fileInput.files || fileInput.files.length === 0) {
        showError('Please select a file.');
        return;
    }
    const file = fileInput.files[0];
    const maxSize = 104857600; // 100MB
    if (file.size > maxSize) {
        showError('File too large. Max 100MB.');
        return;
    }

    // Disable the button and add animation
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<i class="fas fa-globe-asia fa-spin fa-lg"></i> Uploading...';

    const form = new FormData();
    form.append('file', file);
    form.append('password', passwordInput.value);

    try {
        const res = await fetch('/api/send', {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        if (!res.ok) {
            showError((data && data.error) || (data && data.errors && data.errors.map(e => e.msg).join(', ')) || 'Upload failed');
            resetButton(submitButton);
            return;
        }
        document.getElementById('codeDisplay').innerText = data.code;
        document.getElementById('result').style.display = 'block';
        document.getElementById('error').style.display = 'none';
    } catch (err) {
        console.error(err);
        showError('Network error or Too many requests');
    } finally {
        resetButton(submitButton);
    }
});

function resetButton(button) {
    button.disabled = false;
    button.classList.remove('loading');
    button.innerHTML = 'Upload & Get Code';
}

function showError(msg) {
    const el = document.getElementById('error');
    el.style.display = 'block';
    el.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}