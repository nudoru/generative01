import tinycolor from 'tinycolor2';
import random from 'canvas-sketch-util/random';
import { uvFromAngle, quantize } from '../rndrgen/math/math';
import { Particle } from '../rndrgen/systems/Particle';
import { background } from '../rndrgen/canvas/canvas';
import { ratio, scale } from '../rndrgen/sketch';
import { palettes } from '../rndrgen/color/palettes';
import { Vector } from '../rndrgen/math/Vector';
import { simplexNoise2d, simplexNoise3d, cliffordAttractor, jongAttractor } from '../rndrgen/math/attractors';
import { renderField } from '../rndrgen/canvas/fields';
import { oneOf, randomBoolean, randomPointAround, randomWholeBetween } from '../rndrgen/math/random';

/*
Based on
https://tylerxhobbs.com/essays/2020/flow-fields
 */

const drawRibbonPoint = (context, point, i, thickness = 0, height = 0) => {
    const x = point[0];
    const y = point[1];
    context.lineTo(x + thickness, y + thickness);
};

const drawRibbon = (context) => (sideA, sideB, color, stroke = false, thickness = 1) => {
    const startx = sideA[0][0];
    const starty = sideA[0][1];
    const endx = sideB[0][0] + thickness;
    const endy = sideB[0][1] + thickness;

    const rColor = tinycolor(color).clone();
    const gradient = context.createLinearGradient(0, starty - thickness, 0, endy + thickness);
    gradient.addColorStop(0, rColor.toRgbString());
    gradient.addColorStop(1, rColor.clone().darken(20).toRgbString());

    context.beginPath();
    context.moveTo(startx, starty);
    sideA.forEach((w, i) => {
        drawRibbonPoint(context, w, i, 0, thickness * 0.1);
    });
    sideB.forEach((w, i) => {
        drawRibbonPoint(context, w, i, thickness, thickness * 0.1);
    });
    context.lineTo(startx, starty);

    if (stroke) {
        context.strokeStyle = rColor.darken(70).toRgbString();
        context.lineWidth = 0.75;
        context.stroke();
    }

    context.fillStyle = gradient;
    context.fill();
};

export const flowFieldRibbons = () => {
    const config = {
        name: 'flowFieldRibbons',
        ratio: ratio.square,
        scale: scale.standard,
    };

    let canvasWidth;
    let canvasHeight;
    let canvasMidX;
    let canvasMidY;
    const palette = palettes.pop;
    const backgroundColor = tinycolor('white');

    let time = 0;

    const createRibbon = (fieldFn, startX, startY, length, vlimit = 1) => {
        const props = {
            x: startX,
            y: startY,
            velocityX: 0,
            velocityY: 0,
            mass: 1,
        };
        const particle = new Particle(props);
        const coords = [];
        for (let i = 0; i < length; i++) {
            const theta = fieldFn(particle.x, particle.y);
            // theta = quantize(360, theta);
            const force = uvFromAngle(theta);
            particle.applyForce(force);
            particle.velocity = particle.velocity.limit(vlimit);
            particle.updatePosWithVelocity();
            coords.push([particle.x, particle.y]);
            particle.acceleration = new Vector(0, 0);
        }
        return coords;
    };

    const simplex2d = (x, y) => simplexNoise2d(x, y, 0.0005);
    const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
    const clifford = (x, y) => cliffordAttractor(canvasWidth, canvasHeight, x, y);
    const jong = (x, y) => jongAttractor(canvasWidth, canvasHeight, x, y);
    const noise = randomBoolean() ? clifford : jong;

    let maxRadius;

    const setup = ({ canvas, context }) => {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        maxRadius = canvas.width * 0.4;

        background(canvas, context)(backgroundColor);

        renderField(canvas, context, noise, 'rgba(0,0,0,.15)', canvas.width / 10, 5);
    };

    const ribbonLen = randomWholeBetween(50, 1000);
    const ribbonThickness = randomWholeBetween(3, 30);

    const draw = ({ canvas, context }) => {
        const color = oneOf(palette);
        const len = maxRadius * 2; // ribbonLen;

        const rpoint = random.onCircle(maxRadius); // randomPointAround(maxRadius * 0.4);

        const x = rpoint[0] + canvasMidX;
        const y = rpoint[1] + canvasMidY;
        const x2 = x + 2;
        const y2 = y;

        const sideA = createRibbon(noise, x, y, len, 1);
        const sideB = createRibbon(noise, x2, y2, len, 1).reverse();

        drawRibbon(context)(sideA, sideB, color, false, ribbonThickness);

        time += 0.01;
    };

    return {
        config,
        setup,
        draw,
    };
};
