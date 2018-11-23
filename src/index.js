import { render as litRender } from "/lib/lit-html/lit-html.js";

let currentStateStore = null;

function useState(initialValue) {
    if (currentStateStore === null) {
        throw new Error("Cannot call useState outside of render.");
    }

    currentStateStore.counter++;

    if (currentStateStore.firstRender) {
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
        if (currentStateStore !== null) {
            throw new Error("Cannot set state during render.");
        }

        state[counter][0] = value;
        onStateChange();
    };
}

function makeWebComponent(functionalComponent) {
    const webComponent = class extends HTMLElement {
        constructor() {
            super();
            this._props = {};
            this._stateStore = {
                firstRender: true,
                counter: -1,
                state: [],
                onStateChange: this._render.bind(this)
            };
            this._renderRafHandle = undefined;
            this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this._render();
        }

        disconnectedCallback() {
            if (this._renderRafHandle !== undefined) {
                cancelAnimationFrame(this._renderRafHandle);
                this._renderRafHandle = undefined;
            }
        }

        _render() {
            if (this._renderRafHandle !== undefined) {
                return;
            }

            this._renderRafHandle = requestAnimationFrame(() => {
                try {
                    currentStateStore = this._stateStore;
                    const result = functionalComponent(this._props);
                    litRender(result, this.shadowRoot);
                } finally {
                    currentStateStore = null;
                    this._stateStore.firstRender = false;
                    this._stateStore.counter = -1;
                    this._renderRafHandle = undefined;
                }
            });
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
