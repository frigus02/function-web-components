import { render as litRender } from "/lib/lit-html/lit-html.js";

const currentStateStore = {
    state: null,
    onStateChange: null,
    counter: -1
};

function useState(initialValue) {
    if (currentStateStore.state === null) {
        throw new Error("Cannot call useState outside of render.");
    }

    currentStateStore.counter++;

    if (currentStateStore.state.length === currentStateStore.counter) {
        currentStateStore.state.push([
            initialValue,
            createStateSetter(
                currentStateStore.state,
                currentStateStore.counter,
                currentStateStore.onStateChange
            )
        ]);
    }

    return currentStateStore.state[currentStateStore.counter];
}

function createStateSetter(state, counter, onStateChange) {
    return function setState(value) {
        if (currentStateStore.state !== null) {
            throw new Error("Cannot set state during render.");
        }

        state[counter][0] = value;
        onStateChange();
    };
}

function callFunctionalComponent(
    functionalComponent,
    props,
    state,
    onStateChange
) {
    try {
        currentStateStore.state = state;
        currentStateStore.onStateChange = onStateChange;
        currentStateStore.counter = -1;

        return functionalComponent(props);
    } finally {
        currentStateStore.state = null;
        currentStateStore.onStateChange = null;
    }
}

function makeWebComponent(functionalComponent) {
    const webComponent = class extends HTMLElement {
        constructor() {
            super();
            this._props = {};
            this._state = [];
            this._onStateChange = this._render.bind(this);
        }

        connectedCallback() {
            this._render();
        }

        _render() {
            const result = callFunctionalComponent(
                functionalComponent,
                this._props,
                this._state,
                this._onStateChange
            );
            if (result) {
                if (!this.shadowRoot) {
                    this.attachShadow({ mode: "open" });
                }

                litRender(result, this.shadowRoot);
            }
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

export { makeWebComponent, useState };
