function makeWebComponent(functionalComponent) {
    const webComponent = class extends HTMLElement {
        constructor() {
            super();
            this._props = {};
            this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this._render();
        }

        _render() {
            this.shadowRoot.innerHTML = functionalComponent(this._props);
        }
    };

    if (functionalComponent.hasOwnProperty("observedAttributes")) {
        Object.defineProperty(webComponent, "observedAttributes", {
            value: functionalComponent.observedAttributes,
            enumerable: true
        });

        webComponent.prototype.attributeChangedCallback = function(
            name,
            oldValue,
            newValue
        ) {
            this._props[name] = newValue;
            this._render();
        };

        for (const attr of functionalComponent.observedAttributes) {
            Object.defineProperty(webComponent.prototype, attr, {
                get: function() {
                    return this._props[attr];
                },
                set: function(newValue) {
                    this.setAttribute("level", newValue);
                },
                enumerable: true
            });
        }
    }

    return webComponent;
}

export { makeWebComponent };
