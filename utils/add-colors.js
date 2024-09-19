/**
 * @class to create the colors
 */
export default class ColorGenerator {
  constructor(colorArray, parentSelector) {
    this.colorArray = colorArray;
    this.parentColor = document.querySelector(parentSelector);
    this.numColors = 25;
    this.init();
  }

  init() {
    this.generateColors();
  }

  getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  generateColors() {
    for (let i = 1; i <= this.numColors; i++) {

   const finalColor = `#${this.getRandomElement(this.colorArray)}${this.getRandomElement(this.colorArray)}${this.getRandomElement(this.colorArray)}`;
      const colorDiv = this.createColorDiv(finalColor, i);
      this.parentColor.append(colorDiv);

    }
  }

  createColorDiv(color, index) {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("color");
    colorDiv.title = color;
    colorDiv.style.backgroundColor = color;

    colorDiv.classList.add(`color${index}`);
    return colorDiv;
  }
}
