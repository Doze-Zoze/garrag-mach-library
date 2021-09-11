class FrameDataViewer {
  hi(): void {
    console.log('hi from frame data viewer!');
  }
}

declare global {
  interface Window {
    FrameDataViewer: typeof FrameDataViewer;
  }
}

window.FrameDataViewer = FrameDataViewer;

export default FrameDataViewer;
