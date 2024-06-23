let canvas,
	ctx,
	center,
	t = 0;
const size = 800;
const r = size * 0.4;
const balls = [];
const twoPi = Math.PI * 2;
const collisions = {};

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

	for (const key in collisions) {
		const collision = collisions[key];
		const x = collision.center.x;
		const y = collision.center.y;
		const r = 120 - 0.8 * (t - collision.time);
		const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
		const opacity = 255 - (t - collision.time);
		if (r <= 0 || opacity <= 0) {
			delete collisions[key];
		} else {
			let opacityHex = opacity.toString(16);
			if (opacityHex.length < 2) {
				opacityHex = '0' + opacityHex;
			}
			gradient.addColorStop(0, '#ffffff' + opacityHex);
			gradient.addColorStop(1, '#fff0');
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, twoPi);
			ctx.fill();
		}
	}

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
				if (!collisions[key] || t - collisions[key].time > 40) {
					// console.log('unique collision', ball.id, ball2.id, t);
					collisions[key] = {
						time: t,
						center: { x, y },
					};
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
		theta: -Math.PI / 2,
		vel: (Math.random() - 0.5) * 0.02,
		r: 8 + Math.random() * 20,
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
