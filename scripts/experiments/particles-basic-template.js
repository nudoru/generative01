import { Particle, createRandomParticleValues, edgeWrap } from '../rndrgen/systems/Particle';
import { background } from '../rndrgen/canvas/canvas';
import { mapRange } from '../rndrgen/math/math';
import { ratio, scale } from '../rndrgen/sketch';
import { particlePoint } from '../rndrgen/canvas/particles';

export const particleBasicTemplate = () => {
    const config = {
        name: 'particles-template',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 500;
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
            props.radius = 1;

            const h = mapRange(0, canvas.width, 100, 200, props.x);
            const s = 100; // lerpRange(0,10,0,100,prop.radius);
            const l = 50; // lerpRange(0,10,25,75,prop.radius);
            props.color = `hsl(${h},${s}%,${l}%)`;

            particlesArray.push(new Particle(props));
        }
        // background(canvas, context)('white');
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)({ r: 100, g: 100, b: 100, a: 1 });

        // if you want to rotate
        // if(hue++ > 361) hue = 0;

        for (let i = 0; i < numParticles; i++) {
            particlesArray[i].updatePosWithVelocity();
            edgeWrap(canvas, particlesArray[i]);
            particlePoint(context)(particlesArray[i]);
        }
    };

    return {
        config,
        setup,
        draw,
    };
};
