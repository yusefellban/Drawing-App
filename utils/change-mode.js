/**
 * @class to changing application mode 
 */
export default class ThemeToggler {
  constructor(toggleButtonId) {
    this.themeToggle = document.getElementById(toggleButtonId);
    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  toggleTheme() {
    document.body.classList.toggle("dark-mode");
  }

  attachEventListeners() {
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
  }
}
