class Renderer {
  private rootElementId: string;

  constructor({ rootElementId }: { rootElementId: string }) {
    this.rootElementId = rootElementId;
  }

  renderToDOM(content: Node): void {
    const currentElement = document.getElementById(this.rootElementId);
    console.log(currentElement);

    if (currentElement == null) {
      throw new Error(`no element found with id #${this.rootElementId}`);
    }

    while (currentElement.firstChild) {
      currentElement.firstChild.remove();
    }

    currentElement.appendChild(content);
  }
}

export default Renderer;
