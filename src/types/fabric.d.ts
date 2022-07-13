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
  export class controlsUtils {
    static renderSquareControl(
      ctx: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: Object
    );
    static renderCircleControl(
      ctx: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: Object
    );
  }
}
