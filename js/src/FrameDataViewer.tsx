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
  const [frameCount, setFrameCount] = useState(0);
  const [playing, setIsPlaying] = useState(false);

  const tempCanvasId = `frame-data-viewer-temp-canvas-${id}`;
  const canvasId = `frame-data-viewer-canvas-${id}`;
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      const promisedGif = await loadGIF(
        `https://raw.githubusercontent.com/Doze-Zoze/garreg-mach-library/feature/javascript-typescript/images/frame-data/${id}.gif`
      );
      setFrames(promisedGif);
    })();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (frames != null && canvas != null && tempCanvas != null) {
      const canvasContext = canvas.getContext('2d');
      const tempContext = canvas.getContext('2d');

      if (canvasContext && tempContext) {
        const frame = frames[frameCount];
        const imageData = canvasContext.createImageData(
          frame.dims.width,
          frame.dims.height
        );
        canvas.height = frame.dims.height;
        canvas.width = frame.dims.width;
        imageData.data.set(frame.patch);

        canvasContext.putImageData(imageData, 0, 0);
      }
    }
  }, [frames == null, frameCount]);

  if (!frames) {
    return <div>Loading!</div>;
  }

  return (
    <div>
      <h1>{id}</h1>
      <canvas id={tempCanvasId} ref={tempCanvasRef}></canvas>
      <canvas id={canvasId} ref={canvasRef}></canvas>
      <button
        onClick={(): void =>
          setFrameCount((n) => (n < frames.length - 1 ? n + 1 : 0))
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
