import { html, render } from "/lib/lit-html/lit-html.js";
import {
    makeWebComponent,
    useState,
} from "/lib/function-web-components/index.js";

function myButton() {
    const [count, setCount] = useState(1);

    return html`
        <style>
            button {
                border: 1px solid black;
                border-radius: 2px;
                background-color: #ccc;
                padding: 0.4em 1em;
            }

            button:hover {
                background-color: #aaa;
            }

            button:active {
                background-color: #999;
            }
        </style>
        <button @click="${() => setCount(count + 1)}">
            <slot></slot> ${count}
        </button>
    `;
}

customElements.define("my-button", makeWebComponent(myButton, render));
