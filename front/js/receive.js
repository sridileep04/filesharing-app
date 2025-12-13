// public/js/receive.js
document.getElementById('verifyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, password })
        });
        const data = await res.json();
        if (!res.ok) {
            showError((data && data.error) || 'Verification failed');
            return;
        }
        // show file info and set download
        document.getElementById('fname').innerText = data.filename;
        document.getElementById('fsize').innerText = `Size: ${formatBytes(data.size)} — Link expires in ${data.tokenExpiryMinutes} minutes`;
        const btn = document.getElementById('downloadBtn');
        btn.href = data.downloadLink;
        btn.setAttribute('target', '_blank');
        document.getElementById('fileInfo').style.display = 'block';
        document.getElementById('error').style.display = 'none';
    } catch (err) {
        console.error(err);
        showError('Network error');
    }
});

function showError(msg) {
    const el = document.getElementById('error');
    el.style.display = 'block';
    el.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}

function formatBytes(bytes) {
    if (!+bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let idx = 0;
    while (bytes >= 1024 && idx < units.length - 1) {
        bytes /= 1024;
        idx++;
    }
    return `${bytes.toFixed(1)} ${units[idx]}`;
}
