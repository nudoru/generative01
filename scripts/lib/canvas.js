import tinycolor from 'tinycolor2';

import {
    radiansToDegrees,
    pointAngleFromVelocity,
    pointDistance,
    normalizeInverse,
    pointOnCircle,
    uvFromAngle,
    randomWholeBetween,
    randomNumberBetween,
    randomSign,
    randomNormalWholeBetween,
    mapRange,
} from './math';

const TAU = Math.PI * 2;

export let isHiDPI = false;
export let contextScale = 1;

export const resizeCanvas = (canvas, context, width, height, scale) => {
    contextScale = scale || window.devicePixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = Math.floor(width * contextScale);
    canvas.height = Math.floor(height * contextScale);

    if (contextScale === 2) {
        isHiDPI = true;
        context.scale(1, 1);
        // context.scale(2, 2);
    } else {
        context.scale(contextScale, contextScale);
    }
};

export const clearCanvas = (canvas, context) => (_) => context.clearRect(0, 0, canvas.width, canvas.height);

export const fillCanvas = (canvas, context) => (opacity = 1, color = '0,0,0') => {
    context.fillStyle = `rgba(${color},${opacity})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
};

export const background = (canvas, context) => (color = 'black') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(0, 0, canvas.width, canvas.height);
};

export const resetStyles = (context) => {
    context.strokeStyle = '#000';
    context.fillStyle = '#fff';
    context.lineWidth = 1;
    context.setLineDash([]);
    context.lineCap = 'butt';
};

// https://www.rgraph.net/canvas/howto-antialias.html
export const sharpLines = (context) => context.translate(0.5, 0.5);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
// multiply, screen, overlay, soft-light, hard-light, color-dodge, color-burn, darken, lighten, difference, exclusion, hue, saturation, luminosity, color, add, subtract, average, negative
export const blendMode = (context) => (mode = 'source-over') => (context.globalCompositeOperation = mode);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
export const filter = (context) => (f = '') => (context.filter = f);

//----------------------------------------------------------------------------------------------------------------------
// PRIMITIVES
//----------------------------------------------------------------------------------------------------------------------

// TODO, circle or square?
export const pixel = (context) => (x, y, color = 'black', mode = 'square', size) => {
    size = size || contextScale;
    context.fillStyle = tinycolor(color).toRgbString();
    if (mode === 'circle') {
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, false);
        context.fill();
    } else {
        context.fillRect(x, y, size, size);
    }
};

// TODO use circle?
export const drawParticlePoint = (context) => ({ x, y, radius, color }) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color.toRgbString();
    context.fill();
};

export const setStokeColor = (context) => (color) => (context.strokeStyle = tinycolor(color).toRgbString());

// linecap = butt, round, square
export const drawLine = (context) => (x1, y1, x2, y2, strokeWidth = 1, linecap = 'butt') => {
    // color = 'black',
    // context.strokeStyle = tinycolor(color).toRgbString();
    context.lineWidth = strokeWidth;
    context.lineCap = linecap;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

export const drawLineAngle = (context) => (x1, y1, angle, length, strokeWidth, linecap) => {
    const vect = uvFromAngle(angle).setMag(length);
    const x2 = x1 + vect.x;
    const y2 = y1 + vect.y;
    drawLine(context)(x1, y1, x2, y2, strokeWidth, linecap);
};

export const drawCircle = (context) => (strokeWidth, x, y, radius, color) => {
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
};

export const drawCircleFilled = (context) => (x, y, radius, color) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = color;
    context.fill();
};

export const drawRect = (context) => (x, y, w, h, strokeWidth = 1, color) => {
    if (color) {
        context.strokeStyle = tinycolor(color).toRgbString();
    }
    context.lineWidth = strokeWidth;
    context.rect(x, y, w, h);
    context.stroke();
};

export const drawRectFilled = (context) => (x, y, w, h, color = 'white') => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.fillRect(x, y, w, h);
};

export const drawSquareFilled = (context) => (x, y, size, color) => {
    drawRectFilled(context)(x, y, size, size, color);
};

export const drawTriangleFilled = (context) => (x, y, size, color) => {
    const half = size / 2;
    context.beginPath();
    context.moveTo(x - half, y - half);
    context.lineTo(x + half, y);
    context.lineTo(x - half, y + half);
    context.fillStyle = color.toRgbString();
    context.fill();
};

// https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y
export const drawQuadRectFilled = (context) => (x, y, w, h, color) => {
    const mx = x + w / 2;
    const my = y + h / 2;
    context.beginPath();
    // context.strokeStyle = 'green';
    // context.lineWidth = '4';
    context.fillStyle = tinycolor(color).toRgbString();
    context.moveTo(x, my);
    context.quadraticCurveTo(x, y, mx, y);
    context.quadraticCurveTo(x + w, y, x + w, my);
    context.quadraticCurveTo(x + w, y + h, mx, y + h);
    context.quadraticCurveTo(x, y + h, x, my);
    // context.stroke();
    context.fill();
};

// https://www.scriptol.com/html5/canvas/rounded-rectangle.php
// TODO center on x,y
export const drawRoundRectFilled = (context) => (x, y, w, h, corner, color) => {
    if (w < corner || h < corner) {
        corner = Math.min(w, h);
    }

    const r = x + w;
    const b = y + h;
    context.beginPath();
    // context.strokeStyle = 'green';
    // context.lineWidth = '4';
    context.fillStyle = tinycolor(color).toRgbString();
    context.moveTo(x + corner, y);
    context.lineTo(r - corner, y);
    context.quadraticCurveTo(r, y, r, y + corner);
    context.lineTo(r, y + h - corner);
    context.quadraticCurveTo(r, b, r - corner, b);
    context.lineTo(x + corner, b);
    context.quadraticCurveTo(x, b, x, b - corner);
    context.lineTo(x, y + corner);
    context.quadraticCurveTo(x, y, x + corner, y);
    // context.stroke();
    context.fill();
};

// https://www.cssfontstack.com/
export const textStyles = {
    size: (s) => `${s * contextScale}px "Helvetica Neue",Helvetica,Arial,sans-serif`,
    sansHelvetica: (s) => `${s * contextScale}px "Helvetica Neue",Helvetica,Arial,sans-serif`,
    monoCourier: (s) =>
        `${s * contextScale}px "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
    monoLucidia: (s) =>
        `${
            s * contextScale
        }px "Lucida Sans Typewriter", "Lucida Console", monaco, "Bitstream Vera Sans Mono", monospace`,
    serifGeorgia: (s) => `${s * contextScale}px Georgia, Times, "Times New Roman", serif`,
    default: '16px "Helvetica Neue",Helvetica,Arial,sans-serif',
    small: '12px "Helvetica Neue",Helvetica,Arial,sans-serif',
};

export const drawTextFilled = (context) => (text, x, y, color, style) => {
    context.fillStyle = tinycolor(color).toRgbString();
    context.font = style || textStyles.sansHelvetica(16);
    context.fillText(text, x, y);
    // https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
    return context.measureText(text);
};

export const setTextAlignLeftTop = (context) => {
    context.textAlign = 'left';
    context.textBaseline = 'top';
};

export const setTextAlignAllCenter = (context) => {
    context.textAlign = 'center';
    context.textBaseline = 'middle';
};

//----------------------------------------------------------------------------------------------------------------------
// COMPLEX SHAPES
//----------------------------------------------------------------------------------------------------------------------

// Spikes is an array of angles
export const drawSpikeCircle = (context) => ({ x, y, radius, color }, spikes, spikeLength = 5) => {
    const circleStroke = 1;
    const spikeStroke = 2;
    context.strokeStyle = color.toRgbString();
    context.lineWidth = circleStroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    // context.fillStyle = 'rgba(255,255,255,.1)';
    // context.fill();
    context.stroke();
    for (let s = 0; s < spikes.length; s++) {
        const pointA = pointOnCircle(x, y, radius, spikes[s]);
        const pointB = pointOnCircle(x, y, radius + spikeLength, spikes[s]);
        context.strokeStyle = color.toRgbString();
        drawLine(context)(pointA.x, pointA.y, pointB.x, pointB.y, spikeStroke);
    }
};

// "paint splatters" around center point
export const splatter = (context) => (x, y, color, size, amount = 3, range = 20) => {
    for (let i = 0; i < amount; i++) {
        const s = randomWholeBetween(size * 0.25, size * 3);
        // circle dist
        const radius = randomWholeBetween(0, range);
        const angle = randomNumberBetween(0, TAU);
        const xoff = radius * Math.cos(angle);
        const yoff = radius * Math.sin(angle);
        // square dist
        // const xoff = randomWholeBetween(-range, range);
        // const yoff = randomWholeBetween(-range, range);
        drawCircleFilled(context)(x + xoff, y + yoff, s, color);
    }
};

// More detailed implementation https://blog.wolfram.com/2016/05/06/computational-stippling-can-machines-do-as-well-as-humans/
export const stippleRect = (context) => (x, y, width, height, color = 'black', amount = 5, mode = 'ticks') => {
    if (amount <= 0) return;
    amount = Math.min(amount, 10);
    context.save();
    const region = new Path2D();
    region.rect(x, y, width, height);
    context.clip(region);
    const strokeColor = tinycolor(color).toRgbString();
    const size = 3;
    const colStep = mapRange(1, 10, 20, 3, amount);
    const rowStep = mapRange(1, 10, 20, 3, amount);

    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.lineCap = 'round';

    for (let i = 0; i < width; i += colStep) {
        for (let j = 0; j < height; j += rowStep) {
            const tx = x + randomNormalWholeBetween(i, i + colStep);
            const ty = y + randomNormalWholeBetween(j, j + rowStep);
            const tx2 = tx + size;
            const ty2 = ty + size * -1;
            context.beginPath();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
            context.stroke();
        }
    }

    context.restore();
};

export const texturizeRect = (context) => (x, y, width, height, color = 'black', amount = 5, mode = 'circles') => {
    if (amount <= 0) return;

    context.save();
    const region = new Path2D();
    region.rect(x, y, width, height);
    context.clip(region);
    const half = width / 4;
    const strokeColor = tinycolor(color).toRgbString();
    const lineWidth = 1;
    const fillamount = amount * 100;

    for (let i = 0; i < fillamount; i++) {
        const tx = randomWholeBetween(x, x + width);
        const ty = randomWholeBetween(y, y + height);
        const size = randomWholeBetween(half, width);

        context.strokeStyle = strokeColor;
        context.lineWidth = lineWidth;
        context.beginPath();

        if (mode === 'circles') {
            context.arc(tx, ty, size, 0, Math.PI * 2, false);
        } else if (mode === 'circles2') {
            const tx = randomNormalWholeBetween(x, x + width);
            const ty = randomNormalWholeBetween(y, y + height);
            const size = randomWholeBetween(1, width);
            context.arc(tx, ty, size, 0, Math.PI * 2, false);
        } else if (mode === 'xhatch') {
            const tx2 = tx + size * randomSign();
            const ty2 = ty + size * randomSign();
            context.moveTo(tx, ty);
            context.lineTo(tx2, ty2);
        }

        context.stroke();
    }
    context.restore();
};

//----------------------------------------------------------------------------------------------------------------------
// PARTICLE INTERACTIVITY
//----------------------------------------------------------------------------------------------------------------------

export const drawRotatedParticle = (ctx, drawFn, particle, ...args) => {
    const pSaveX = particle.x;
    const pSaveY = particle.y;
    particle.x = 0;
    particle.y = 0;
    ctx.save();
    ctx.translate(pSaveX, pSaveY);
    ctx.rotate(particle.heading);
    drawFn(ctx)(particle, args);
    ctx.restore();
    particle.x = pSaveX;
    particle.y = pSaveY;
};

export const connectParticles = (context) => (pArray, proximity, useAlpha = true) => {
    const len = pArray.length;
    for (let a = 0; a < len; a++) {
        // all consecutive particles
        for (let b = a; b < len; b++) {
            const pA = pArray[a];
            const pB = pArray[b];
            const distance = pointDistance(pA, pB);
            if (distance < proximity) {
                const pColor = pA.color;
                if (useAlpha) {
                    pColor.setAlpha(normalizeInverse(0, proximity, distance));
                }
                context.strokeStyle = pColor.toHslString();
                drawLine(context)(pA.x, pA.y, pB.x, pB.y, 0.5);
            }
        }
    }
    resetStyles(context);
};

export const drawPointTrail = (context) => (particle) => {
    const trailLen = particle.xHistory.length;
    context.lineWidth = particle.radius;
    const pColor = particle.color;
    const aFade = (100 / trailLen) * 0.01;
    let alpha = 1;
    const sFade = (particle.radius * 2) / trailLen;
    let stroke = particle.radius * 2;
    for (let i = 0; i < trailLen; i++) {
        const startX = i === 0 ? particle.x : particle.xHistory[i - 1];
        const startY = i === 0 ? particle.y : particle.yHistory[i - 1];
        drawLine(context)(startX, startY, particle.xHistory[i], particle.yHistory[i], stroke);
        pColor.setAlpha(alpha);
        context.strokeStyle = pColor.toRgbString();
        alpha -= aFade;
        stroke -= sFade;
    }
};

//----------------------------------------------------------------------------------------------------------------------
// DEBUG
//----------------------------------------------------------------------------------------------------------------------

export const drawTestPoint = (context) => ({ x, y, radius, color }) => {
    context.strokeStyle = color.toRgbString();
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
    drawLine(context)(x, y, x + radius, y, 1);
};

export const drawParticleVectors = (context) => (particle) => {
    const vmult = 5;
    const amult = 100;
    const vel = 'green';
    const acc = 'yellow';
    const { velocity } = particle;
    const { acceleration } = particle;

    context.strokeStyle = tinycolor(vel).toRgbString();
    drawLine(context)(particle.x, particle.y, particle.x + velocity.x * vmult, particle.y + velocity.y * vmult, 1);

    context.strokeStyle = tinycolor(acc).toRgbString();
    drawLine(context)(
        particle.x,
        particle.y,
        particle.x + acceleration.x * amult,
        particle.y + acceleration.y * amult,
        1
    );
};

export const drawMouse = (context) => ({ x, y, radius }) => {
    if (x === undefined || y === undefined) return;
    context.strokeStyle = 'rgba(255,255,255,.25)';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(255,255,255,.1)';
    context.fill();
    context.stroke();
};

export const drawAttractor = (context) => ({ x, y, mass, g }, mode, radius) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(0,0,0,.1)';
    context.fill();

    context.beginPath();
    context.arc(x, y, Math.sqrt(mass) * g, 0, Math.PI * 2, false);
    context.fillStyle = mode === 1 ? 'rgba(0,255,0,.25)' : 'rgba(255,0,0,.25)';
    context.fill();
};

export const renderField = ({ width, height }, context, fn, color = 'black', cell = '50', length) => {
    const mid = cell / 2;
    for (let x = 0; x < width; x += cell) {
        for (let y = 0; y < height; y += cell) {
            const theta = fn(x, y);
            const vect = uvFromAngle(theta).setMag(length || mid);
            const x1 = x + mid;
            const y1 = y + mid;
            const x2 = x1 + vect.x;
            const y2 = y1 + vect.y;
            context.strokeStyle = tinycolor(color);
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }
};
