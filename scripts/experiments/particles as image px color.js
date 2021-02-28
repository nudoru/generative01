import sourcePng from '../../hi1.png';
import {
    clearCanvas,
    drawMouse,
    drawSquareFilled,
    background,
    getImageDataFromImage,
    getImageDataColor,
    connectParticles,
} from '../lib/canvas';
import { mapRange, randomNumberBetween, scalePointToCanvas } from '../lib/math';
import {
    createRandomParticleValues,
    edgeBounce,
    edgeWrap,
    Particle,
    pointPush,
    updatePosWithVelocity,
} from '../lib/Particle';

export const hiImage01 = (_) => {
    const config = {
        width: 600,
        height: 600,
    };

    const numParticles = 200;
    const imageSize = 100; // square
    let imageZoomFactor;
    const png = new Image();
    png.src = sourcePng;
    const particlesArray = [];
    let imageData;
    let imageColorData;
    const cropColor = 255 / 2;

    const createColorArrayFromImageData = (imageData) => {
        const data = [];
        for (let y = 0, { height } = imageData; y < height; y++) {
            for (let x = 0, { width } = imageData; x < width; x++) {
                data.push({ x, y, ...getImageDataColor(imageData, x, y) });
            }
        }
        return data;
    };

    const setup = ({ canvas, context }) => {
        imageData = getImageDataFromImage(context)(png);
        clearCanvas(canvas, context)();

        imageZoomFactor = canvas.width / imageSize;

        // imageColorData = createColorArrayFromImageData(imageData);

        for (let i = 0; i < numParticles; i++) {
            const props = createRandomParticleValues(canvas);
            props.radius = imageZoomFactor;
            const pxColor = getImageDataColor(
                imageData,
                Math.round(props.x / imageZoomFactor),
                Math.round(props.y / imageZoomFactor)
            );
            props.color = `rgba(${pxColor.r},${pxColor.g},${pxColor.b}, ${pxColor.a})`;
            particlesArray.push(new Particle(props));
        }
    };

    const draw = ({ canvas, context, mouse }) => {
        background(canvas, context)('yellow');

        for (let i = 0; i < numParticles; i++) {
            updatePosWithVelocity(particlesArray[i]);
            edgeBounce(canvas, particlesArray[i]);

            const pxColor = getImageDataColor(
                imageData,
                Math.round(particlesArray[i].x / imageZoomFactor),
                Math.round(particlesArray[i].y / imageZoomFactor)
            );

            // particlesArray[i].color = `rgb(${pxColor.r},${pxColor.g},${pxColor.b})`;
            particlesArray[i].color = `rgba(${pxColor.r},${pxColor.g},${pxColor.b}, ${pxColor.a})`;

            drawSquareFilled(context)(particlesArray[i]);
        }
        connectParticles(context)(particlesArray, 100, true);
    };

    return {
        config,
        setup,
        draw,
    };
};
