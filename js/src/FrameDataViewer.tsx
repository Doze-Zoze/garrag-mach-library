import { FC, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { parseGIF, decompressFrames, ParsedFrame } from 'gifuct-js';

interface FrameDataViewerProps {
  id: string;
}

const loadGIF = (url): Promise<ParsedFrame[]> =>
  new Promise((resolve) => {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', url, true);
    oReq.responseType = 'arraybuffer';

    oReq.onload = function (): void {
      const arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        const gif = parseGIF(arrayBuffer);
        const frames = decompressFrames(gif, true);
        // render the gif
        resolve(frames);
      }
    };

    oReq.send(null);
  });

const FrameDataViewer: FC<FrameDataViewerProps> = ({ id }) => {
  const [frames, setFrames] = useState<ParsedFrame[] | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setIsPlaying] = useState(false);

  const tempCanvasId = `frame-data-viewer-temp-canvas-${id}`;
  const canvasId = `frame-data-viewer-canvas-${id}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullGifCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      const promisedGif = await loadGIF(
        `https://raw.githubusercontent.com/Doze-Zoze/garreg-mach-library/feature/javascript-typescript/images/frame-data/${id}.gif`
      );
      setFrames(promisedGif);
    })();
  }, []);

  useEffect(() => {
    // var c === const canvas
    // var ctx === canvasContext
    // var tempCanvas === tempCanvasRef.current
    // var gifCanvas === fullGifCanvasRef.current
    // var frameImageData === frameImageDataRef.current

    if (tempCanvasRef.current == null) {
      tempCanvasRef.current = document.createElement('canvas');
    }
    if (fullGifCanvasRef.current == null) {
      fullGifCanvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const fullGifCanvas = fullGifCanvasRef.current;

    if (
      frames == null ||
      canvas == null ||
      tempCanvas == null ||
      fullGifCanvas == null
    ) {
      return;
    }

    const canvasCtx = canvas.getContext('2d');
    const tempCanvasCtx = tempCanvas.getContext('2d');
    const fullGifCanvasCtx = fullGifCanvas.getContext('2d');

    if (
      canvasCtx == null ||
      tempCanvasCtx == null ||
      fullGifCanvasCtx == null
    ) {
      return;
    }

    canvas.width = frames[0].dims.width;
    canvas.height = frames[0].dims.height;
    fullGifCanvas.width = canvas.width;
    fullGifCanvas.height = canvas.height;

    const frame = frames[frameIndex];
    if (frame.disposalType === 2) {
      fullGifCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const dims = frame.dims;

    if (
      !frameImageDataRef.current ||
      dims.width != frameImageDataRef.current.width ||
      dims.height != frameImageDataRef.current.height
    ) {
      tempCanvas.width = dims.width;
      tempCanvas.height = dims.height;
      frameImageDataRef.current = tempCanvasCtx.createImageData(
        dims.width,
        dims.height
      );
    }

    // set the patch data as an override
    frameImageDataRef.current.data.set(frame.patch);

    // draw the patch back over the canvas
    tempCanvasCtx.putImageData(frameImageDataRef.current, 0, 0);
    fullGifCanvasCtx.drawImage(tempCanvas, dims.left, dims.top);

    const imageData = fullGifCanvasCtx.getImageData(
      0,
      0,
      fullGifCanvas.width,
      fullGifCanvas.height
    );

    canvasCtx.putImageData(imageData, 0, 0);
    // canvasCtx.drawImage(
    //   canvas,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height,
    //   0,
    //   0,
    //   pixelsX,
    //   pixelsY
    // );
    // canvasCtx.drawImage(
    //   canvas,
    //   0,
    //   0,
    //   pixelsX,
    //   pixelsY,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height
    // );
  }, [frames == null, frameIndex]);

  if (!frames) {
    return <div>Loading!</div>;
  }

  return (
    <div>
      <h1>{id}</h1>
      <canvas id={canvasId} ref={canvasRef}></canvas>
      <button
        onClick={(): void =>
          setFrameIndex((n) => (n < frames.length - 1 ? n + 1 : 0))
        }
      >
        Next frame
      </button>
    </div>
  );
};

const renderFrameDataViewer = (
  rootElementId: string,
  args: FrameDataViewerProps
): void => {
  render(<FrameDataViewer {...args} />, document.getElementById(rootElementId));
};

declare global {
  interface Window {
    renderFrameDataViewer: typeof renderFrameDataViewer;
  }
}

window.renderFrameDataViewer = renderFrameDataViewer;

export default FrameDataViewer;
