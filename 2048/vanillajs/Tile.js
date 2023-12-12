export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  /**
   * Constructs a new instance of the class.
   *
   * @param {HTMLElement} tileContainer - The container element to append the tile to.
   * @param {number} [value=Math.random() > 0.5 ? 2 : 4] - The initial value of the tile.
   */
  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    // Create and append tile element to the container
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);

    // Set initial value
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;

    // Calculate and update styles based on value
    const power = Math.log2(v);
    const backgroundLightness = 100 - power * 9;
    const textLightness = backgroundLightness <= 50 ? 90 : 10;

    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${textLightness}%`
    );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }

  // Remove tile from the DOM
  remove() {
    this.#tileElement.remove();
  }

  // Utility method to wait for a CSS transition or animation to complete
  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        { once: true }
      );
    });
  }
}
