import Renderer from './Renderer';

class FrameDataViewer extends Renderer {
  constructor({ rootElementId }: { rootElementId: string }) {
    super({ rootElementId });
  }

  hi(): void {
    console.log('hi from frame data viewer!');
  }

  render(): void {
    const node = document.createElement('span');
    const textnode = document.createTextNode('Test render');
    node.appendChild(textnode);
    this.renderToDOM(node);
  }
}

declare global {
  interface Window {
    FrameDataViewer: typeof FrameDataViewer;
  }
}

window.FrameDataViewer = FrameDataViewer;

export default FrameDataViewer;
