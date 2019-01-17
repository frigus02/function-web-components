const currentStateStore = {
    state: null,
    onStateChange: null,
    counter: -1,
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
            ),
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

function callFunctionComponent(functionComponent, props, state, onStateChange) {
    try {
        currentStateStore.state = state;
        currentStateStore.onStateChange = onStateChange;
        currentStateStore.counter = -1;

        return functionComponent(props);
    } finally {
        currentStateStore.state = null;
        currentStateStore.onStateChange = null;
    }
}

function renderRawHtml(html, parentNode) {
    parentNode.innerHTML = html;
}

function kebabToCamelCase(str) {
    return str
        .split("-")
        .map((value, index) =>
            index === 0 ? value : value[0].toUpperCase() + value.substr(1)
        )
        .join("");
}

function camelToKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function makeWebComponent(functionComponent, render = renderRawHtml) {
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
            const result = callFunctionComponent(
                functionComponent,
                this._props,
                this._state,
                this._onStateChange
            );
            if (result) {
                if (!this.shadowRoot) {
                    this.attachShadow({ mode: "open" });
                }

                render(result, this.shadowRoot);
            }
        }
    };

    if (functionComponent.hasOwnProperty("props")) {
        Object.defineProperty(webComponent, "observedAttributes", {
            value: functionComponent.props.map(camelToKebabCase),
            enumerable: true,
        });

        webComponent.prototype.attributeChangedCallback = function(
            name,
            oldValue,
            newValue
        ) {
            this._props[kebabToCamelCase(name)] = newValue;
            this._render();
        };

        for (const prop of functionComponent.props) {
            Object.defineProperty(webComponent.prototype, prop, {
                get: function() {
                    return this._props[prop];
                },
                set: function(newValue) {
                    this.setAttribute(camelToKebabCase(prop), newValue);
                },
                enumerable: true,
            });
        }
    }

    return webComponent;
}

export { makeWebComponent, useState };
