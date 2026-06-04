/**
 * @class
 * to Create the canvas
 */
export default class DrawingApp {
  constructor(
    canvasId,
    btnClass,
    widthInputId,
    heightInputId,
    eraserModeId,
    colorSelectorClass,
    zoomSliderId,
    TextSliderId
  ) {
    this.canvas = document.querySelector(canvasId);
    this.btn = document.querySelector(btnClass);
    this.ctx = this.canvas.getContext("2d");
    this.widthInput = document.getElementById(widthInputId);
    this.heightInput = document.getElementById(heightInputId);
    this.eraserMode = document.getElementById(eraserModeId);
    this.chooseColor = document.querySelectorAll(colorSelectorClass);

    this.zoomSlider = document.getElementById(zoomSliderId);

    this.TextSlider = document.getElementById(TextSliderId);
    this.isDrawing = false;
    this.x = 0;
    this.y = 0;
    this.savedImage = null;
    this.isErasing = false;
    this.penColor = "black";
    this.fSize = 10;
    this.init();
  }

  init() {
    this.setCanvasSize();
    this.attachEventListeners();
    this.initColorSelection();
    this.mouse();
  }

  ctxSet() {
    this.ctx.lineWidth = this.fSize;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
  }

  setCanvasSize() {
    const maxWidth = window.innerWidth - 20;

    this.canvas.width =
      this.widthInput.value == 0
        ? Math.min(window.innerWidth * 0.8, maxWidth)
        : Math.min(Number(this.widthInput.value), maxWidth);

    this.canvas.height =
      this.heightInput.value == 0 ? 500 : this.heightInput.value;

    document.getElementById("widthCanvas").textContent = this.canvas.width;
    document.getElementById("heightCanvas").textContent = this.canvas.height;
    this.ctxSet();
  }

  saveDrawing() {
    this.savedImage = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  restoreDrawing() {
    if (this.savedImage) {
      this.ctx.putImageData(this.savedImage, 0, 0);
    }
  }

  updateCanvasSize() {
    this.setCanvasSize();
    this.restoreDrawing();
  }

  /**
   * Get accurate canvas coordinates from a mouse or touch event.
   * Uses getBoundingClientRect() for correct mapping even when
   * the canvas is scrolled, transformed, or offset by CSS.
   */
  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  startDrawing(e) {
    const coords = this.getCanvasCoords(e);
    this.x = coords.x;
    this.y = coords.y;
    this.isDrawing = true;

    if (e.cancelable) e.preventDefault();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw(e) {
    if (!this.isDrawing) return;

    const coords = this.getCanvasCoords(e);
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.fSize;

    if (this.isErasing) {
      this.ctx.globalCompositeOperation = "destination-out";
    } else {
      this.ctx.globalCompositeOperation = "source-over";
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(coords.x, coords.y);
    this.ctx.stroke();

    this.saveDrawing();

    this.x = coords.x;
    this.y = coords.y;

    if (e.cancelable) e.preventDefault();
  }

  downloadImage() {
    const a = document.createElement("a");
    a.href = this.canvas.toDataURL("image/png");
    a.download = "canvas-img.png";
    a.click();
  }

  mouse() {
    this.canvas.addEventListener("mousemove", (e) => {
      const coords = this.getCanvasCoords(e);
      document.getElementById("mouseX").textContent = Math.round(coords.x);
      document.getElementById("mouseY").textContent = Math.round(coords.y);
    });
  }

  zoomCanvas() {
    const scaleValue = this.zoomSlider.value;
    this.canvas.style.transform = `scale(${scaleValue})`;
  }

  textControl() {
    this.fSize = this.TextSlider.value;
    this.ctxSet();
  }

  toggleEraser() {
    this.isErasing = this.eraserMode.checked;
    this.canvas.style.cursor = this.isErasing ? "grabbing" : "crosshair";
  }

  initColorSelection() {
    this.chooseColor.forEach((color) => {
      color.addEventListener("click", () => {
        this.penColor = color.style.backgroundColor;
        this.isErasing = false;
        this.eraserMode.checked = false;
        this.canvas.style.cursor = "crosshair";
      });
    });
  }

  attachEventListeners() {
    this.widthInput.addEventListener("change", () => this.updateCanvasSize());
    this.heightInput.addEventListener("change", () => this.updateCanvasSize());
    this.eraserMode.addEventListener("change", () => this.toggleEraser());
    this.zoomSlider.addEventListener("input", () => this.zoomCanvas());
    this.TextSlider.addEventListener("input", () => this.textControl());

    // Mouse Events
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    this.canvas.addEventListener("mouseleave", () => this.stopDrawing());

    // Touch Events for mobile — { passive: false } to allow preventDefault
    this.canvas.addEventListener(
      "touchstart",
      (e) => this.startDrawing(e),
      { passive: false }
    );
    this.canvas.addEventListener(
      "touchend",
      () => this.stopDrawing(),
      { passive: true }
    );
    this.canvas.addEventListener(
      "touchmove",
      (e) => this.draw(e),
      { passive: false }
    );
    this.canvas.addEventListener(
      "touchcancel",
      () => this.stopDrawing(),
      { passive: true }
    );

    window.addEventListener("resize", () => {
      this.setCanvasSize();
      this.restoreDrawing();
    });

    this.btn.addEventListener("click", () => this.downloadImage());
  }
}