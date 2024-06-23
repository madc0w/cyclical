let canvas,
	ctx,
	center,
	t = 0;
const size = 800;
const r = size * 0.4;
const balls = [];
const twoPi = Math.PI * 2;
const lastCollisionTimes = {};

function load() {
	canvas = document.getElementById('canvas');
	canvas.width = size;
	canvas.height = size;
	ctx = canvas.getContext('2d');

	center = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};

	draw();
}

function draw() {
	ctx.clearRect(0, 0, size, size);

	ctx.beginPath();
	ctx.arc(center.x, center.y, r, 0, twoPi);
	ctx.strokeStyle = '#002';
	ctx.stroke();

	for (const ball of balls) {
		const x = center.x + r * Math.cos(ball.theta);
		const y = center.y + r * Math.sin(ball.theta);
		ctx.beginPath();
		ctx.arc(x, y, ball.r, 0, twoPi);
		ctx.fillStyle = ball.color;
		ctx.fill();

		for (const ball2 of balls) {
			const theta1 = boundTheta(ball.theta);
			const theta2 = boundTheta(ball2.theta);
			// if (ball2 != ball) {
			// 	console.log(ball.theta % twoPi, ball2.theta % twoPi);
			// }
			if (
				ball2 != ball &&
				theta1 < boundTheta(theta2 + 0.02) &&
				theta1 > boundTheta(theta2 - 0.02)
			) {
				const key = [ball.id, ball2.id].sort().join('-');
				// console.log('collision', ball.id, ball2.id, t, key);
				if (!lastCollisionTimes[key] || t - lastCollisionTimes[key] > 40) {
					// console.log('unique collision', ball.id, ball2.id, t);
					lastCollisionTimes[key] = t;

					const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200);
					gradient.addColorStop(0, '#fff');
					gradient.addColorStop(1, '#fff0');
					ctx.fillStyle = gradient;
					ctx.beginPath();
					ctx.arc(x, y, 200, 0, twoPi);
					ctx.fill();
				}
			}
		}

		ball.theta += ball.vel;
	}

	t++;
	requestAnimationFrame(draw);
}

function addBall() {
	balls.push({
		id: balls.length,
		theta: Math.PI / 2,
		vel: (Math.random() - 0.5) * 0.02,
		r: 4 + Math.random() * 12,
		color: '#f22',
	});
}

function boundTheta(theta) {
	let bounded = theta % twoPi;
	if (bounded < 0) {
		bounded += twoPi;
	}
	return bounded;
}
