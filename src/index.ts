type StateSetter<T> = (newValue: T) => void;

type StateEntry<T> = [T, StateSetter<T>];

type State = StateEntry<any>[];

type StateChangeCallback = () => void;

type StateStore = {
    state: State;
    onStateChange: StateChangeCallback;
    counter: number;
};

type Props = {
    [key: string]: any;
};

type FunctionWebComponent<T> = (props: Props) => T | undefined;

type RenderCallback<T> = (html: T, parentNode: ShadowRoot) => void;

type MakeWebComponentOptions<T> = {
    attrs?: string[];
    props?: string[];
    render?: RenderCallback<T>;
};

interface GeneratedCustomElement extends HTMLElement {
    _props: Props;
    _state: State;
    _onStateChange: StateChangeCallback;
    _render: () => void;

    observedAttributes?: string[];
    attributeChangedCallback?(
        name: string,
        oldValue: string,
        newValue: string
    ): void;

    connectedCallback: () => void;
}

type GeneratedCustomElementClass = {
    prototype: GeneratedCustomElement;
    new (): GeneratedCustomElement;
};

let currentStateStore: StateStore | null = null;

function withStateStore<T>(state: StateStore, func: () => T): T {
    try {
        currentStateStore = state;
        return func();
    } finally {
        currentStateStore = null;
    }
}

export function useState<T>(initialValue: T): StateEntry<T> {
    const store = currentStateStore;
    if (!store) {
        throw new Error("Cannot call useState outside of render.");
    }

    store.counter++;

    if (store.state.length === store.counter) {
        const stateEntry: StateEntry<T> = [initialValue, null!];
        stateEntry[1] = createStateSetter(stateEntry, store.onStateChange);
        store.state.push(stateEntry);
    }

    return store.state[store.counter];
}

function createStateSetter<T>(
    stateEntry: StateEntry<T>,
    onStateChange: StateChangeCallback
): StateSetter<T> {
    return function setState(value: T) {
        if (currentStateStore) {
            throw new Error("Cannot set state during render.");
        }

        stateEntry[0] = value;
        onStateChange();
    };
}

function renderRawHtml(html: any, parentNode: ShadowRoot) {
    parentNode.innerHTML = html;
}

function camelToKebabCase(str: string) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function kebabToCamelCase(str: string) {
    return str
        .split("-")
        .map((value, index) =>
            index === 0 ? value : value[0].toUpperCase() + value.substr(1)
        )
        .join("");
}

function generatePropGetterSetters(
    prototype: GeneratedCustomElement,
    props: string[],
    syncWithAttributes: boolean
) {
    for (const prop of props) {
        const attrName = camelToKebabCase(prop);
        Object.defineProperty(prototype, prop, {
            get: function() {
                return this._props[prop];
            },
            set: function(newValue) {
                if (syncWithAttributes) {
                    this.setAttribute(attrName, newValue);
                } else {
                    this._props[prop] = newValue;
                    this._render();
                }
            },
            enumerable: true,
        });
    }
}

export function makeWebComponent<T>(
    functionComponent: FunctionWebComponent<T>,
    options: MakeWebComponentOptions<T>
): GeneratedCustomElementClass {
    const render: RenderCallback<T> = options.render || renderRawHtml;
    const webComponent: GeneratedCustomElementClass = class extends HTMLElement {
        _props = {};
        _state = [];
        _onStateChange = this._render.bind(this);

        connectedCallback() {
            this._render();
        }

        _render() {
            const result = withStateStore(
                {
                    state: this._state,
                    onStateChange: this._onStateChange,
                    counter: -1,
                },
                () => functionComponent(this._props)
            );
            if (result) {
                if (!this.shadowRoot) {
                    this.attachShadow({ mode: "open" });
                }

                render(result, this.shadowRoot!);
            }
        }
    };

    if (options.attrs) {
        Object.defineProperty(webComponent, "observedAttributes", {
            value: options.attrs.map(camelToKebabCase),
            enumerable: true,
        });

        webComponent.prototype["attributeChangedCallback"] = function(
            name: string,
            oldValue: string,
            newValue: string
        ) {
            this._props[kebabToCamelCase(name)] = newValue;
            this._render();
        };

        generatePropGetterSetters(webComponent.prototype, options.attrs, true);
    }

    if (options.props) {
        generatePropGetterSetters(webComponent.prototype, options.props, false);
    }

    return webComponent;
}
