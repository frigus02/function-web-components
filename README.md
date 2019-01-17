# Function Web Components

[![npm](https://img.shields.io/npm/v/function-web-components.svg)](https://www.npmjs.com/package/function-web-components)

A library to write Web Components as a single function.

Components written using this library look similar to [Function Components in React](https://reactjs.org/docs/components-and-props.html#function-and-class-components). You can specify props, which are mirrored as attributes and passed to the function. Internal state can saved using an API similar to [Hooks](https://reactjs.org/docs/hooks-intro.html). Your function is invoked every time props/attributes or state changes.

## Table of Contents

-   [Install](#install)
-   [Usage](#usage)
-   [API](#api)
-   [Contributing](#contributing)
-   [License](#license)

## Install

```sh
# npm
npm install function-web-components

# yarn
yarn add function-web-components
```

## Usage

Very simple example:

```js
import { makeWebComponent } from "function-web-components";

function myGreeting({ name = "You" }) {
    return `<p>Hello ${name}.</p>`;
}

myGreeting.props = ["name"];

customElements.define("my-greeting", makeWebComponent(myGreeting));
```

More advanced example using [lit-html](https://github.com/Polymer/lit-html) to render:

```js
import { makeWebComponent, useState } from "function-web-components";
import { html, render } from "lit-html";

function myAdvancedGreeting({ givenName }) {
    const [surname, setSurname] = useState("...");
    const askForSurname = () => {
        const response = prompt("Enter surname:");
        if (response) {
            setSurname(response);
        }
    };

    return html`
        <p>
            Hello ${givenName} ${surname}.
            <button @click=${askForSurname}>Change surname</button>
        </p>
    `;
}

myAdvancedGreeting.props = ["givenName"];

customElements.define(
    "my-advanced-greeting",
    makeWebComponent(myAdvancedGreeting, render)
);
```

Then use the elements as usual in your HTML:

```html
<my-greeting name="Jan"></my-greeting>
<my-advanced-greeting given-name="Jan"></my-advanced-greeting>
```

## API

### `makeWebComponent(functionComponent[, render])`

Create a Custom Element.

-   Arguments

    -   `functionComponent` - The component function. It will be invoked with the props object as the first and only argument. All expected props need to be specified in a string array as a property `props` on the function object:

        ```js
        functionComponent.props = ["a", "longPropName"];
        ```

        Prop names written in camel case are converted to kebab case for attribute names. The example above makes the component listen for attributes `a` and `long-prop-name`.

    -   `render` - If specified this function will be invoked every time the components needs to be rendered to the DOM. It's invoked with the result of the functionComponent invocation and the first and the parent node as the second argument.

-   Returns a class extending `HTMLElement`, which can be passed to `customElements.define`.

### `useState([initialValue])`

Provides a way for function components to store internal state. It must be called syncronously in the `functionComponent` function. Similar to React Hooks it can be called multiple times and must not be called conditionally.

-   Arguments

    -   `initialValue` - The initial value for this piece of state.

-   Returns an array with two entries. The first is the current value, the second is a setter function for this piece of state. The setter must not be invoked syncronously in the `functionComponent` function. It should be called on user interaction or at least in a new microtask. Example:

    ```js
    const [fruit, setFruit] = useState("Apple");
    const [amount, setAmount] = useState(42);

    setTimeout(() => {
        setAmount(amount - 1);
    }, 5000);
    ```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
