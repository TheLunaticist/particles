window.SPAWN_RANGE = 30;
window.PARTICLE_NUMBER = 100;
window.START_VEL = 2;
window.PARTICLE_MASS = 3;
window.MAX_VEL = 1;

window.MAX_FORCE = 5;

window.PARTICLE_RADIUS = 10;

window.particles = [window.PARTICLE_NUMBER];
window.canvas = document.getElementById("canvas");
window.dContext = window.canvas.getContext("2d");


class Particle {
	constructor(x, y, velX, velY) {
		this.pos = new Vector2(
			x + Math.random() * window.SPAWN_RANGE * 2 - window.SPAWN_RANGE,
			y + Math.random() * window.SPAWN_RANGE * 2 - window.SPAWN_RANGE);
		this.vel = new Vector2(
			velX + Math.random() * window.START_VEL * 2 - window.START_VEL,
			velY + Math.random() * window.START_VEL * 2 - window.START_VEL);
	}
	
	draw() {
		window.dContext.fillStyle = "yellow";
		window.dContext.fillRect(this.pos.x - 2, this.pos.y - 2, 5, 5);
	}
	
	calculateMove(ownId) {
		//gravity
		this.vel.y += 0.01
		
		//collision
		for(i = 0; i < PARTICLE_NUMBER; i++) {
			if(i != ownId) {
				let vecToParticle = Vector2.subtract(particles[i].pos, this.pos);
				let dist = vecToParticle.getLength();
				if(dist < window.PARTICLE_RADIUS * 2) {
					Vector2.subtract(this.vel, Vector2.scaleVec(vecToParticle, 2));
				}
			}
		}
		
	}
	
	move() {
		this.pos = Vector2.add(this.pos, this.vel);
		if(this.pos.x < 0) {
			this.vel.x = -this.vel.x;
		} else if(this.pos.x > canvas.width) {
			this.pos.x -= canvas.width;
		} else if(this.pos.y < 0) {
			this.pos.y += canvas.height;
		} else if(this.pos.y > canvas.height) {
			this.vel.y = -this.vel.y;
		}
	}
}

//main loop
function loop(){
	window.dContext.fillStyle = "black";
	window.dContext.fillRect(0, 0, canvas.width, canvas.height);
	
	for(i = 0; i < PARTICLE_NUMBER; i++) {
		particles[i].calculateMove(i);
	}
	
	for(i = 0; i < PARTICLE_NUMBER; i++) {
		particles[i].move();
	}

	for(i = 0; i < PARTICLE_NUMBER; i++) {
		particles[i].draw();
	}	
	
	window.requestAnimationFrame(loop);
}

//initializing particles
for(i = 0; i < PARTICLE_NUMBER; i++) {
	particles[i] = new Particle(canvas.width / 2, canvas.height / 2, 0, 0);
}

loop();



