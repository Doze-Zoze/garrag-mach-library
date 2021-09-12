import { FC, useEffect } from 'react';
import { render } from 'react-dom';
import gifFrames from 'gif-frames';

interface FrameDataViewerProps {
  id: string;
}

const FrameDataViewer: FC<FrameDataViewerProps> = ({ id }) => {
  useEffect(() => {
    gifFrames({ url: `./images/frame-data/${id}.gif`, frames: 0 }).then(
      (frameData) => {
        console.log('done gif!');
        console.log(frameData[0].getImage());
      }
    );
  }, []);

  return <div>{id}</div>;
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
