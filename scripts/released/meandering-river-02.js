import tinycolor from 'tinycolor2';
import { background } from '../rndrgen/canvas/canvas';
import { orientation, ratio, scale } from '../rndrgen/sketch';
import { bicPenBlue, warmWhite } from '../rndrgen/color/palettes';
import { MeanderingRiver } from '../rndrgen/systems/MeanderingRiver';
import { chaikinSmooth } from '../rndrgen/math/segments';
import { simplexNoise2d } from '../rndrgen/math/attractors';
import { getPointsOnCircleOld } from '../rndrgen/math/grids';
import { randomNormalWholeBetween } from '../rndrgen/math/random';
import { createSplineFromPointArray } from '../rndrgen/math/points';
import { pointPathPA } from '../rndrgen/canvas/primatives';

/*
Meandering River class at ../rndrgen/MeanderingRiver
 */

const createHorizontalPath = ({ width, height }, startX, startY, steps = 20) => {
    const coords = [];
    const incr = Math.round(width / steps);
    const midx = width / 2;
    for (let i = startX; i < width; i += incr) {
        // greater variation in the middle
        const midDist = Math.round(midx - Math.abs(i - midx));
        const y = randomNormalWholeBetween(startY - midDist, startY + midDist);

        coords.push([i, y]);
    }
    coords.push([width, startY]);
    return coords;
};

const createVerticalPath = ({ width, height }, startX, startY, steps = 20) => {
    const coords = [];
    const incr = Math.round(height / steps);
    const midy = height / 2;
    for (let i = startY; i < height; i += incr) {
        // greater variation in the middle
        const midDist = Math.round(midy - Math.abs(i - midy));
        const x = randomNormalWholeBetween(startX - midDist, startX + midDist);

        coords.push([x, i]);
    }
    coords.push([startX, height]);
    return coords;
};

export const meanderingRiver02 = () => {
    const config = {
        name: 'meandering-river-02',
        ratio: ratio.a3plus,
        scale: scale.hidpi,
        orientation: orientation.portrait,
        // multiplier: 1,
        // drawLimit: 100,
    };

    let ctx;
    let canvasMidX;
    let canvasMidY;
    const renderScale = config.scale; // 1 or 2
    const rivers = [];
    let time = 0;

    const backgroundColor = warmWhite;

    // const simplex2d = (x, y) => simplexNoise2d(x, y, 0.002);
    // const simplex3d = (x, y) => simplexNoise3d(x, y, time, 0.0005);
    // const clifford = (x, y) => cliffordAttractor(canvas.width, canvas.height, x, y);
    // const jong = (x, y) => jongAttractor(canvas.width, canvas.height, x, y);

    const noise = (x, y) => simplexNoise2d(x, y, 0.002);
    const maxHistory = 10;
    const historyStep = 25;

    const wrapped = false;

    const setup = ({ canvas, context }) => {
        ctx = context;
        canvasMidX = canvas.width / 2;
        canvasMidY = canvas.height / 2;
        background(canvas, context)(backgroundColor);
        const horizontal = createSplineFromPointArray(createHorizontalPath(canvas, 0, canvasMidY, 40));
        const vertical = createSplineFromPointArray(createVerticalPath(canvas, canvasMidX, 0, 40));
        const circle = getPointsOnCircleOld(canvasMidX, canvasMidY, canvasMidX / 2, Math.PI * 4, false);

        const cs = {
            mixTangentRatio: 0.45,
            mixMagnitude: 1.25, // 1.75
            curvemeasure: 4,
            curvesize: 5,
            pointremove: 5,
            oxbowProx: 2.5,
        };

        const circleRiver = new MeanderingRiver(circle, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: true,
            handleOxbows: true,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,

            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3,
        });

        const verticalRiver = new MeanderingRiver(vertical, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: wrapped,
            handleOxbows: true,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,

            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3,
        });

        const horizontalRiver = new MeanderingRiver(horizontal, {
            maxHistory,
            storeHistoryEvery: historyStep,
            fixedEndPoints: 1,
            influenceLimit: 0,
            wrapEnd: wrapped,
            handleOxbows: true,

            mixTangentRatio: cs.mixTangentRatio,
            mixMagnitude: cs.mixMagnitude,
            oxbowProx: cs.oxbowProx,
            oxbowPointIndexProx: cs.curvemeasure,
            measureCurveAdjacent: cs.curvemeasure,
            curveSize: cs.curvesize,
            pointRemoveProx: cs.pointremove,

            // pushFlowVectorFn: flowRightToMiddle(0.5, canvasMidY),

            noiseFn: noise,
            noiseMode: 'mix',
            noiseStrengthAffect: 0,
            mixNoiseRatio: 0.3,
        });

        rivers.push(circleRiver, horizontalRiver);
    };

    const draw = ({ canvas, context }) => {
        // background(canvas, context)(backgroundColor.clone().setAlpha(0.005));
        // renderField(canvas, context, noise, 'rgba(0,0,0,.5)', 30, 15);

        // https://colorhunt.co/palette/264684
        const riverColor = [bicPenBlue, tinycolor('#fed049')];
        const closed = [true, false];

        // step
        rivers.forEach((r) => {
            for (let i = 0; i < renderScale; i++) {
                r.step();
            }
        });

        // main
        rivers.forEach((r, i) => {
            const c = riverColor[i].clone().setAlpha(0.15); // tinycolor(`hsl(${time},70,50)`);

            // r.oxbows.forEach((o) => {
            //     // const w = Math.abs(mapRange(0, o.startLength, riverWeight[i] / 2, riverWeight[i], o.points.length));
            //     pointPathPA(ctx)(o.points, c, 1);
            // });

            const points = chaikinSmooth(r.points, 4);
            if (points.length) pointPathPA(ctx)(points, c, 2, closed[i]);
        });

        time += 0.25;
    };

    return {
        config,
        setup,
        draw,
    };
};
