self.onmessage = (event) => {
    switch (event.data.type) {
        case "init":
            setupCanvas(event.data.canvas, event.data.width, event.data.height);
            break;
        case "resize":
            resizeCanvas(event.data.width, event.data.height);
            break;
        case "addParticle":
            addParticles(event.data.count);
            break;
    }
};

let canvas, ctx, width, height;
let particles = [];

function setupCanvas(offscreen, w, h) {
    canvas = offscreen;
    ctx = canvas.getContext("2d");
    width = w;
    height = h;

    // Создаем 50 частиц изначально
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(Math.random() * width, Math.random() * height));
    }

    updateParticleCount();
    animate();
}

function resizeCanvas(w, h) {
    width = w;
    height = h;
}

function addParticles(count) {
    debugger
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(Math.random() * width, Math.random() * height));
    }
    updateParticleCount();
}

function updateParticleCount() {
    self.postMessage({ type: "updateCount", count: particles.length });
}

// Класс частицы
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 5 + 2;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        this.vy += 0.05;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.radius < 0 || this.x + this.radius > width) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > height) this.vy *= -0.8;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}
