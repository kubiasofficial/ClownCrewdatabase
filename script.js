
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
    document.getElementById('loader').classList.add('hidden');
    const login = document.getElementById('login-container');
    login.classList.remove('hidden');
    setTimeout(() => login.classList.add('visible'), 100);
}, 20000);

// Optional: Prevent form submit (demo only)
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Přihlášení odesláno! (demo)');
});
