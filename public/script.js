// Matrix background animation - více vrstev, různé rychlosti, tmavší odstíny
function createMatrixLayer(targetId, color, fontSize, speed, alpha) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById(targetId).appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let cols = Math.floor(window.innerWidth / fontSize);
    let ypos = Array(cols).fill(0);
    function draw() {
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = fontSize + 'pt monospace';
        for (let i = 0; i < cols; i++) {
            let text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, i * fontSize, ypos[i] * fontSize);
            if (ypos[i] * fontSize > canvas.height && Math.random() > 0.975) {
                ypos[i] = 0;
            }
            ypos[i]++;
        }
    }
    setInterval(draw, speed);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.floor(window.innerWidth / fontSize);
        ypos = Array(cols).fill(0);
    });
}
// Hlavní matrix vrstvy
createMatrixLayer('matrix-bg', '#00ff41', 18, 50, 0.10); // hlavní
createMatrixLayer('matrix-bg2', '#009f2f', 16, 70, 0.18); // tmavší, pomalejší
createMatrixLayer('matrix-bg3', '#005f1a', 22, 90, 0.22); // nejtmavší, nejpomalejší

// Loader and login animation
// Progress bar animace
function hideLoaderAndShowLogin() {
    document.getElementById('loader').classList.add('hidden');
    const login = document.getElementById('login-container');
    login.classList.remove('hidden');
    setTimeout(() => login.classList.add('visible'), 100);
}
if (!window.location.search.includes('username=')) {
    // Loader běží jen pokud nejsme po Discord ověření
    const progress = document.getElementById('progress');
    let progressValue = 0;
    const progressInterval = setInterval(() => {
        progressValue += 0.5;
        if (progressValue > 100) progressValue = 100;
        progress.style.width = progressValue + '%';
    }, 100);
    setTimeout(() => {
        clearInterval(progressInterval);
        progress.style.width = '100%';
        hideLoaderAndShowLogin();
    }, 20000);
} else {
    // Pokud jsme po Discord ověření, loader a logo v pozadí skryjeme
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('matrix-bg').style.display = 'none';
    document.getElementById('matrix-bg2').style.display = 'none';
    document.getElementById('matrix-bg3').style.display = 'none';
}

// Optional: Prevent form submit (demo only)
// document.getElementById('login-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     alert('Přihlášení odesláno! (demo)');
// });

// Discord login button handler
window.addEventListener('DOMContentLoaded', () => {
    const discordBtn = document.getElementById('discord-login-btn');
    if (discordBtn) {
        discordBtn.addEventListener('click', () => {
            const clientId = '1487478912719130788';
            const redirectUri = encodeURIComponent('https://clown-crewdatabase.vercel.app/api/discord');
            const scope = 'identify';
            const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
            window.location.href = discordUrl;
        });
    }

    // Po návratu z Discordu (reálné ověření přes backend)
    const url = new URL(window.location.href);
    const username = url.searchParams.get('username');
    const avatar = url.searchParams.get('avatar');
    const id = url.searchParams.get('id');
    if (username && id) {
        // Skryj login, ukaž identity check sekci
        document.getElementById('discord-login-area').classList.add('hidden');
        const profileArea = document.getElementById('discord-profile-area');
        profileArea.classList.remove('hidden');
        // Zobraz profilovku, nick a text "Ověřuji tvoji identitu"
        let avatarUrl = avatar && avatar !== '' ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
        profileArea.innerHTML = `<div id='identity-check'><img src='${avatarUrl}' alt='Profil'><div class='nick'>${username}</div><div class='verifying'>Ověřuji tvoji identitu...</div></div>`;
        // Po 2s zobraz modal "Ověřeno! Vítej, ..."
        setTimeout(() => {
            showVerifiedModal(username);
            // Po 10s skryj modal a zobraz hlavní menu
            setTimeout(() => {
                hideVerifiedModal();
                profileArea.classList.add('hidden');
                showMainMenu(username, avatarUrl);
            }, 10000);
        }, 2000);
    }
});

function showVerifiedModal(username) {
    let modal = document.createElement('div');
    modal.id = 'verified-modal';
    modal.innerHTML = `<div class='verified-box'>Ověřeno! Vítej, ${username}</div>`;
    document.body.appendChild(modal);
}
function hideVerifiedModal() {
    let modal = document.getElementById('verified-modal');
    if (modal) modal.remove();
}
function showMainMenu(username, avatar) {
    // Vlož hlavní menu (zatím jen logo)
    const main = document.createElement('div');
    main.id = 'main-menu';
    main.style.display = 'flex';
    main.style.flexDirection = 'column';
    main.style.alignItems = 'center';
    main.style.justifyContent = 'center';
    main.style.height = '100vh';
    main.innerHTML = `<div class="logo-circle" style="margin-bottom:30px;"><img src='/logo.png' style='width:160px;height:160px;'></div>`;
    document.body.appendChild(main);
}
