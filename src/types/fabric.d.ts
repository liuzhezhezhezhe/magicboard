declare namespace fabric {
  export class EraserBrush extends BaseBrush {
    /**
     * Constructor
     * @param {Canvas} canvas
     */
    constructor(canvas: Canvas);
    /**
     * Constructor
     * @param {Canvas} canvas
     * @return {PencilBrush} Instance of a pencil brush
     */
    initialize(canvas: Canvas): PencilBrush;
  }
}
