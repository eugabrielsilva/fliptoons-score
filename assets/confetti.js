class Confetti {
    constructor(options = {}) {
        this.canvas = options.canvas || document.getElementById('confetti');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.confetti = [];
        this.animationFrameId = null;
        this.stopTimeoutId = null;
        this.isRunning = false;

        this.confettiCount = options.confettiCount || 100;
        this.gravity = options.gravity || 0.5;
        this.terminalVelocity = options.terminalVelocity || 5;
        this.drag = options.drag || 0.075;
        this.duration = options.duration || 5000;
        this.colors = options.colors || [
            {front: 'red', back: 'darkred'},
            {front: 'green', back: 'darkgreen'},
            {front: 'blue', back: 'darkblue'},
            {front: 'yellow', back: 'darkyellow'},
            {front: 'orange', back: 'darkorange'},
            {front: 'pink', back: 'darkpink'},
            {front: 'purple', back: 'darkpurple'},
            {front: 'turquoise', back: 'darkturquoise'}
        ];

        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.render = this.render.bind(this);
    }

    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    resizeCanvas() {
        if(!this.canvas || !this.ctx) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initConfetti() {
        if(!this.canvas) return;

        for(let i = 0; i < this.confettiCount; i++) {
            this.confetti.push({
                color: this.colors[Math.floor(this.randomRange(0, this.colors.length))],
                dimensions: {
                    x: this.randomRange(10, 20),
                    y: this.randomRange(10, 30)
                },
                position: {
                    x: this.randomRange(0, this.canvas.width),
                    y: this.canvas.height - 1
                },
                rotation: this.randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1
                },
                velocity: {
                    x: this.randomRange(-25, 25),
                    y: this.randomRange(0, -50)
                }
            });
        }
    }

    render() {
        if(!this.ctx || !this.canvas || !this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = this.confetti.length - 1; i >= 0; i--) {
            const confetto = this.confetti[i];
            const width = confetto.dimensions.x * confetto.scale.x;
            const height = confetto.dimensions.y * confetto.scale.y;

            this.ctx.translate(confetto.position.x, confetto.position.y);
            this.ctx.rotate(confetto.rotation);

            confetto.velocity.x -= confetto.velocity.x * this.drag;
            confetto.velocity.y = Math.min(confetto.velocity.y + this.gravity, this.terminalVelocity);
            confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
            confetto.position.x += confetto.velocity.x;
            confetto.position.y += confetto.velocity.y;

            if(confetto.position.y >= this.canvas.height) {
                this.confetti.splice(i, 1);
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                continue;
            }

            if(confetto.position.x > this.canvas.width) confetto.position.x = 0;
            if(confetto.position.x < 0) confetto.position.x = this.canvas.width;

            confetto.scale.y = Math.cos(confetto.position.y * 0.1);
            this.ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
            this.ctx.fillRect(-width / 2, -height / 2, width, height);
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        if(this.confetti.length <= 10) {
            this.initConfetti();
        }

        this.animationFrameId = window.requestAnimationFrame(this.render);
    }

    launch(duration = this.duration) {
        if(!this.canvas || !this.ctx || this.isRunning) return;

        this.stop(false);
        this.isRunning = true;
        this.canvas.style.display = 'block';
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);

        this.confetti = [];
        this.initConfetti();
        this.render();

        if(duration > 0) {
            this.stopTimeoutId = window.setTimeout(() => {
                this.stop(false);
            }, duration);
        }
    }

    stop(clearCanvas = true) {
        if(!this.isRunning) return;
        this.isRunning = false;

        if(this.animationFrameId) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if(this.stopTimeoutId) {
            window.clearTimeout(this.stopTimeoutId);
            this.stopTimeoutId = null;
        }

        window.removeEventListener('resize', this.resizeCanvas);
        this.confetti = [];
        if(this.canvas) {
            this.canvas.style.display = 'none';
        }

        if(clearCanvas && this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

window.Confetti = Confetti;