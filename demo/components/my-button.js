import { makeWebComponent } from "/lib/functional-web-components.js";

function myButton() {
    return `
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
        <button>
            <slot></slot>
        </button>
    `;
}

customElements.define("my-button", makeWebComponent(myButton));
