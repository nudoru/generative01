import tinycolor from 'tinycolor2';
import { edgeBounce, Particle, createRandomParticleValues } from '../rndrgen/systems/Particle';
import { background } from '../rndrgen/canvas/canvas';
import { Vector } from '../rndrgen/math/Vector';
import { particleRotated } from '../rndrgen/canvas/particles';
import { drawTestPoint } from '../rndrgen/canvas/debugShapes';
import { line, rectFilled } from '../rndrgen/canvas/primatives';

const debugParticleVectors = (context) => (particle) => {
    const vmult = 5;
    const amult = 100;
    const vel = 'green';
    const acc = 'yellow';
    const { velocity } = particle;
    const { acceleration } = particle;

    context.strokeStyle = tinycolor(vel).toRgbString();
    line(context)(particle.x, particle.y, particle.x + velocity.x * vmult, particle.y + velocity.y * vmult, 1);

    context.strokeStyle = tinycolor(acc).toRgbString();
    line(context)(particle.x, particle.y, particle.x + acceleration.x * amult, particle.y + acceleration.y * amult, 1);
};

export const forcesDev = () => {
    const config = {
        width: 700,
        height: 700,
        // fps: 30,
    };

    const numParticles = 10;
    const particlesArray = [];

    let canvasCenterX;
    let canvasCenterY;
    let centerRadius;

    const setup = ({ canvas, context }) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);

            // props.color = 'white';
            // props.mass = 1;
            props.radius = Math.sqrt(props.mass) * 10;
            props.y = 0;
            props.velocityX = 0;
            props.velocityY = 0;
            particlesArray.push(new Particle(props));
        }
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.5 });
        rectFilled(context)(0, canvas.height / 2, canvas.width, canvas.height / 2, 'rgba(255,255,255,.1');
        for (let i = 0; i < numParticles; i++) {
            const gravity = new Vector(0, 0.25);
            const wind = new Vector(1, 0);

            const weight = gravity.mult(particlesArray[i].mass);

            if (mouse.isDown) {
                particlesArray[i].applyForce(wind);
            }

            particlesArray[i].applyForce(weight);

            if (particlesArray[i].y + particlesArray[i].radius >= canvas.height) {
                friction(particlesArray[i]);
            }

            if (particlesArray[i].y + particlesArray[i].radius >= canvas.height / 2) {
                drag(particlesArray[i]);
            }

            particlesArray[i].updatePosWithVelocity();
            edgeBounce(canvas, particlesArray[i]);
            particleRotated(context, drawTestPoint, particlesArray[i]);
            debugParticleVectors(context)(particlesArray[i]);
            particlesArray[i].acceleration = { x: 0, y: 0 };
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
