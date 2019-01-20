class MyHeadline extends HTMLElement {
    static get observedAttributes() {
        return ["level"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._level = 1;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this.setAttribute("level", value);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "level") {
            this._level = newValue;
        }

        this._render();
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <h${this.level}>
                <slot></slot>
            </h${this.level}>
        `;
    }
}

customElements.define("my-headline", MyHeadline);
