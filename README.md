# Function Web Components

[![npm](https://img.shields.io/npm/v/function-web-components.svg)](https://www.npmjs.com/package/function-web-components)

Write [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) as a single function.

Components written using this library look similar to [Function Components in React](https://reactjs.org/docs/components-and-props.html#function-and-class-components):

-   You declare attributes and properties for your Custom Element. Both are passed to the function as the first argument.
-   Internal state can saved using `useState`; similar to [Hooks](https://reactjs.org/docs/hooks-intro.html).
-   Your function is invoked every time attributes/properties or state changes.
-   The function should return HTML, which is then rendered to the elements Shadow DOM (rendering can be overridden to use libraries like [lit-html](https://github.com/Polymer/lit-html)).

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

Simple example:

```js
import { makeWebComponent } from "function-web-components";

function myGreeting({ name = "You" }) {
    return `<p>Hello ${name}.</p>`;
}

customElements.define(
    "my-greeting",
    makeWebComponent(myGreeting, {
        attrs: ["name"],
    })
);
```

```html
<my-greeting name="Jan"></my-greeting>
```

Advanced example showing properties, state and using [lit-html](https://github.com/Polymer/lit-html):

```js
import { makeWebComponent, useState } from "function-web-components";
import { html, render } from "lit-html";

function myTodo({ todo }) {
    const [done, setDone] = useState(false);
    const toggleDone = () => {
        setDone(!done);
    };

    return html`
        <div class="${done ? "done" : "todo"}">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <button @click=${toggleDone}>Toggle</button>
        </div>
    `;
}

customElements.define(
    "my-todo",
    makeWebComponent(myTodo, {
        props: ["todo"],
        render,
    })
);
```

```js
const element = document.createElement("my-todo");
element.todo = {
    title: "Buy apples",
    description: "I really need that.",
};
document.body.appendChild(element);
```

## API

### `makeWebComponent(functionComponent[, options])`

Creates a Custom Element (a class extending `HTMLElement`), which can be passed to [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

#### Arguments

-   `functionComponent` - The component function.

    It receives one argument: `props`. This is an object containing the values of all declared attributes and properties (see `options.attrs` and `options.props`).

    In addition the object contains a setter function for each value called `set<PropertyName>`. For example the property `givenName` would have the setter function `setGivenName`.

-   `options.attrs` - String array of attributes used in the component. For each attribute a corresponding property is created. When either attribute or property are changed, the other will reflect that change. Attributes are bound to DOM restrictions and can only be strings. Example:

    ```js
    makeWebComponent(myComp, { attrs: ["age", "givenName"] });
    ```

    Names written in camel case are converted to kebab case for attribute names. The example above makes the component listen for attributes `age` and `given-name`.

-   `options.props` - String array of properties used in the component. Properties are not reflected as attributes and can have any type. Example:

    ```js
    makeWebComponent(myComp, { props: ["userObject"] });
    ```

-   `options.render` - If specified this function will be invoked every time the components needs to be rendered to the DOM. It's invoked with the result of the functionComponent invocation and the first and the parent node as the second argument. Example:

    ```js
    function renderInnerHTML(html, parentNode) {
        parentNode.innerHTML = html;
    }
    ```

### `useState([initialValue])`

Provides a way for function components to store internal state. Returns an array with two entries. The first is the current value, the second is a setter function for this piece of state. You can call this function multiple times, if you want to store multiple pieces of state.

#### Constraints

-   It must be called syncronously in the `functionComponent` function.
-   It must not be called conditionally.
-   The setter must not be invoked syncronously in the `functionComponent` function. It should be called on user interaction or at least in a new microtask. This is because setting state triggers another render.

#### Arguments

-   `initialValue` - The initial value for this piece of state.

#### Example

```js
const [fruit, setFruit] = useState("Apple");
const [amount, setAmount] = useState(42);

setTimeout(() => {
    setAmount(amount - 1);
}, 5000);
```

### `props.set<PropertyName>(newValue[, options])`

For every declared attribute or property a function component gets passed a corresponding setter function. For example the property `givenName` would have the setter function `setGivenName`. This sets the attribute/property to a new value and can optionally dispatch a change event. It does not trigger a render.

#### Arguments

-   `newValue` - The new value for this attribute or property.

-   `options.eventName` - If specified, the function dispatches a custom event with name. The new value is used as the [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail).

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
