import tinycolor from 'tinycolor2';
import { mapRange, uvFromAngle, angleFromVector, snapNumber, quantize, houghQuantize } from '../rndrgen/math/math';
import { edgeWrap, Particle, createRandomParticleValues } from '../rndrgen/systems/Particle';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/sketch';
import { nicePalette, hslFromRange } from '../rndrgen/color/palettes';
import { Vector } from '../rndrgen/math/Vector';
import {
    simplexNoise2d,
    simplexNoise3d,
    sinField,
    cliffordAttractor,
    jongAttractor,
    diagLines,
} from '../rndrgen/math/attractors';
import { create2dNoise, create3dNoise, oneOf, randomWholeBetween } from '../rndrgen/math/random';
import { circleFilled, lineAtAngle, quadRectFilled, rectFilled, roundRectFilled } from '../rndrgen/canvas/primatives';

/*
https://www.khanacademy.org/math/multivariable-calculus/thinking-about-multivariable-function/visualizing-vector-valued-functions/v/parametric-curves
Based on https://www.youtube.com/watch?v=BjoM9oKOAKY
Attractor fns https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8
Read
https://codepen.io/DonKarlssonSan/post/particles-in-simplex-noise-flow-field
https://tylerxhobbs.com/essays/2020/flow-fields
 */

const TAU = Math.PI * 2;

const tile = (context, x, y, size, color, heading) => {
    roundRectFilled(context)(x, y, size - 2, size - 2, 3, color);

    // context.save();
    // context.translate(x, y);
    // context.rotate(heading);
    // // quadRectFilled(context)(0, 0, size, size, color);
    // roundRectFilled(context)(0, 0, size - 2, size - 2, 3, color);
    // // rectFilled(context)(0, 0, size, size, color);
    // context.restore();
};

export const flowFieldBasic = () => {
    const config = {
        name: 'flowField',
        ratio: ratio.square,
        scale: scale.standard,
    };

    const numParticles = 100;
    const particlesArray = [];

    const palette = nicePalette();
    let clifford;
    let jong;

    let time = 0;

    const tileSize = 10;

    let tileHistory = [];
    let currentTilePos = [];
    const checkHistory = (x, y) => {
        const pos = `${x},${y}`;
        return tileHistory.includes(pos);
    };

    const createRandomParticle = (canvas) => {
        const props = createRandomParticleValues(canvas);
        props.x = randomWholeBetween(0, canvas.width);
        props.y = randomWholeBetween(0, canvas.height);
        props.velocityX = 0;
        props.velocityY = 0;
        const color = tinycolor(oneOf(palette));
        props.color = color.desaturate(randomWholeBetween(0, 25));
        return new Particle(props);
    };

    const setup = ({ canvas, context }) => {
        clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
        jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);

        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(createRandomParticle(canvas));
        }

        background(canvas, context)('rgba(50,50,50,1)');
    };

    const drawTile = (canvas, context, force, particle) => {
        const angle = angleFromVector(force);

        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(4);
        particle.updatePosWithVelocity();
        edgeWrap(canvas, particle);

        const x = snapNumber(tileSize, particle.x);
        const y = snapNumber(tileSize, particle.y);

        // Prevent overlap with a previous tile
        if (!checkHistory(x, y)) {
            currentTilePos.push(`${x},${y}`);
            tile(context, x, y, tileSize, particle.color, particle.heading);
            return true;
        }

        return false;
    };

    const drawPixel = (canvas, context, force, particle, color, rad = 1) => {
        particle.applyForce(force);
        particle.velocity = particle.velocity.limit(5);
        particle.updatePosWithVelocity();
        edgeWrap(canvas, particle);
        const pcolor = color || particle.color;
        const x = snapNumber(rad * 2, particle.x);
        const y = snapNumber(rad * 2, particle.y);
        circleFilled(context)(x, y, rad, pcolor);
        return true;
    };

    const renderField = ({ width, height }, context, fn, cell) => {
        const mid = cell / 2;
        for (let x = 0; x < width; x += cell) {
            for (let y = 0; y < height; y += cell) {
                const theta = fn(x, y);
                lineAtAngle(context)(x + mid, y + mid, theta, mid);
            }
        }
    };

    const draw = ({ canvas, context }) => {
        // renderField(canvas, context, simplexNoise2d, 20);
        // drawParticles({ canvas, context });
        drawFibers({ canvas, context });
    };

    const drawParticles = ({ canvas, context }) => {
        // background(canvas, context)('rgba(50,50,50,.01)');
        // const n3d = (x, y) => simplexNoise3d(x, y, time);
        // renderField(canvas, context, n3d, 20);

        for (let i = 0; i < numParticles; i++) {
            const particle = particlesArray[i];

            // vals from -5 to 5
            const sNoise2d = simplexNoise2d(particle.x, particle.y);
            const sNoise3d = simplexNoise3d(particle.x, particle.y, time);
            const diag = diagLines(particle.x, particle.y);
            const sinF = sinField(particle.x, particle.y);
            const clif = clifford(particle.x, particle.y);
            const jng = jong(particle.x, particle.y);

            // const theta = clif;
            // const theta = snapNumber(Math.PI / 2, sNoise3d);
            const theta = quantize(2, sNoise3d);

            const force = uvFromAngle(theta);

            // force.x += Math.cos(theta) * 0.1;
            // force.y += Math.sin(theta) * 0.1;

            const clr = hslFromRange(5, 180, 270, Math.abs(theta)).setAlpha(0.25);
            const size = 3; // mapRange(0, 5, 1, 5, Math.abs(theta));

            // drawTile(canvas, context, force, particle);
            drawPixel(canvas, context, force, particle, clr, size);

            particle.acceleration = new Vector(0, 0);
        }

        time += 0.01;
    };

    const drawFibers = ({ canvas, context }) => {
        const particle = createRandomParticle(canvas);
        const length = 500;
        const run = true;
        for (let i = 0; i < length; i++) {
            const sNoise2d = simplexNoise2d(particle.x, particle.y);
            const sNoise3d = simplexNoise3d(particle.x, particle.y, time);
            const sinF = sinField(particle.x, particle.y);
            const clif = cliffordAttractor(canvas.width, canvas.height, particle.x, particle.y);
            const jong = jongAttractor(canvas.width, canvas.height, particle.x, particle.y);

            const theta = jong;
            const force = uvFromAngle(theta);
            const clr = hslFromRange(5, 270, 359, Math.abs(theta)).setAlpha(0.1);
            const size = mapRange(0, 5, 1, 5, Math.abs(theta));

            if (run) {
                // run = drawTile(canvas, context, force, particle);
                drawPixel(canvas, context, force, particle);
            }

            particle.acceleration = new Vector(0, 0);
        }
        tileHistory = tileHistory.concat(currentTilePos);
        currentTilePos = [];
    };

    return {
        config,
        setup,
        draw,
    };
};

/*
// const noiseFn = (x, y) => round2(create2dNoise(x, y, 1, 0.001));
// noiseField = createNoiseField(canvas.width, canvas.width, fieldResolution, fieldResolution, 0, 0, noiseFn);
// drawNoiseField(context, noiseField);
const createNoiseField = (width, height, columns, rows, margin = 0, gutter = 0, noiseFn) => {
    const points = [];
    const coords = [];

    const colStep = Math.ceil((width - margin * 2 - gutter * (columns - 1)) / columns);
    const rowStep = Math.ceil((height - margin * 2 - gutter * (rows - 1)) / rows);

    for (let col = 0; col < columns; col++) {
        const x = margin + col * colStep + gutter * col;
        coords[col] = [];
        for (let row = 0; row < rows; row++) {
            const y = margin + row * rowStep + gutter * row;
            const noise = noiseFn ? noiseFn(x, y) : 0;
            points.push([x, y, noise]);
            coords[col][row] = noise;
        }
    }

    return { points, coords, columnWidth: colStep, rowHeight: rowStep };
};

// const sNoise = getNoiseFieldVectorAtPoint(
//     noiseField,
//     fieldResolution,
//     canvas.width,
//     canvas.height,
//     particle.x,
//     particle.y
// );

// Map canvas coords to field resolution and get index in array
const getNoiseFieldVectorAtPoint = (field, resolution, width, height, x, y) => {
    const noiseX = Math.floor(mapRange(0, width, 0, resolution - 1, x));
    const noiseY = Math.floor(mapRange(0, height, 0, resolution - 1, y));
    return field.coords[noiseX][noiseY] * TAU;
};

const drawNoiseField = (context, field) => {
    // setTextAlignAllCenter(context);
    field.points.forEach((point) => {
        const x = point[0];
        const y = point[1];
        const n = point[2];
        const midX = field.columnWidth / 2;
        const midY = field.rowHeight / 2;

        // rectFilled(context)(x, y, grid.columnWidth, grid.rowHeight, `hsl(${360 * (n * 2)},100,50)`);
        rectFilled(context)(x, y, field.columnWidth, field.rowHeight, `rgba(0,0,0,${n / 2 + 0.5}`);
        lineAtAngle(context)(x + midX, y + midY, n * TAU, midY);
        // textFilled(context)(n, x + midX, y + midY, 'black', textStyles.size(10));
    });
};
*/
