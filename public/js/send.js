// public/js/send.js
document.getElementById('sendForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file');
    const passwordInput = document.getElementById('password');

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
            return;
        }
        document.getElementById('codeDisplay').innerText = data.code;
        document.getElementById('result').style.display = 'block';
        document.getElementById('error').style.display = 'none';
    } catch (err) {
        console.error(err);
        showError('Network error or Too many requests');
    }
});

function showError(msg) {
    const el = document.getElementById('error');
    el.style.display = 'block';
    el.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}
