import {
    attractPoint,
    avoidPoint,
    edgeBounce,
    Particle,
    updatePosWithVelocity,
    createRandomParticleValues,
    edgeWrap,
} from './lib/particle';
import {
    clearCanvas,
    connectParticles,
    drawMouse,
    drawPoint,
    drawPointTrail,
    drawRotatedParticle,
    drawTestPoint,
    drawTriangle,
    background,
    drawRake,
} from './lib/canvas';
import { clamp } from './lib/math';
import { Vector } from './lib/vector';

export const debugDev = () => {
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

    const setup = (canvas, context) => {
        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;
        centerRadius = canvas.height / 4;

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);

            // props.color = 'white';
            // props.mass = 1;
            props.radius = Math.sqrt(props.mass) * 10;
            // props.y = canvasCenterY;
            props.velocityX = 0;
            props.velocityY = 0;
            particlesArray.push(new Particle(props));
        }
    };

    // const targetX = mouse.x ? mouse.x : canvas.width / 2;
    // const targetY = mouse.y ? mouse.y : canvas.height / 2;
    // accelerateToPoint(targetX, targetY, particlesArray[i]);
    const accelerateToPoint = (targetX, targetY, particle) => {
        const magnitude = 0.001;
        const vLimit = 5;
        const accX = ((targetX - particle.x) * magnitude) / particle.mass;
        const accY = ((targetY - particle.y) * magnitude) / particle.mass;
        particle.velocityX += accX;
        particle.velocityY += accY;
        particle.velocityX = clamp(-vLimit, vLimit, particle.velocityX);
        particle.velocityY = clamp(-vLimit, vLimit, particle.velocityY);
    };

    const applyForce = (fVect, particle) => {
        const fV = fVect.div(particle.mass);
        const aV = particle.aVector.add(fV);
        const pV = particle.vVector.add(aV);
        particle.vVector = pV;
    };

    const friction = ({ width, height }, particle) => {
        if (particle.y + particle.radius >= height) {
            const mu = 0.1;
            const normal = particle.mass;
            const vfriction = particle.vVector
                .normalize()
                .mult(-1)
                .mag(mu * normal);
            applyForce(vfriction, particle);
        }
    };

    const draw = (canvas, context, mouse) => {
        background(canvas, context)({ r: 0, g: 0, b: 50, a: 0.5 });
        for (let i = 0; i < numParticles; i++) {
            const gravity = new Vector(0, 0.5);
            const wind = new Vector(1, 0);

            const weight = gravity.mult(particlesArray[i].mass);

            if (mouse.isDown) {
                applyForce(wind, particlesArray[i]);
            }

            applyForce(weight, particlesArray[i]);
            friction(canvas, particlesArray[i]);
            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);
            drawRotatedParticle(context, drawTestPoint, particlesArray[i]);
            particlesArray[i].aVector = { x: 0, y: 0 };
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
