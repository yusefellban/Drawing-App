import ColorGenerator from "./utils/add-colors.js";
import ThemeToggler from "./utils/change-mode.js";
import DrawingApp from "./utils/DrawingApp.js";

//colrs
const colorArray = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];
const colorGenerator = new ColorGenerator(colorArray, ".colors");

const drawingApp = new DrawingApp(
  "#canvas",
  ".btn",
  "canvasWidth",
  "canvasHeight",
  "eraserMode",
  ".color",
  "zoom-slider",
  "Text-slider"
);

//change mode

// Usage
const themeToggler = new ThemeToggler("themeToggle");
