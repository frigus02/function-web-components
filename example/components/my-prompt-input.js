import { makeWebComponent } from "/lib/function-web-components/index.js";
import { html, render } from "/lib/lit-html/lit-html.js";

function myPromptInput({ value, setValue, promptBuilder }) {
    const changeValue = () => {
        const response = prompt(
            promptBuilder ? promptBuilder() : "Enter new value:"
        );
        if (response) {
            setValue(response, { eventName: "change" });
        }
    };

    return html`
        <style>
            :host {
                display: inline-block;
            }

            span {
                border-bottom: 1px dotted lightgray;
            }
        </style>

        <span>${value}</span> <button @click=${changeValue}>Change</button>
    `;
}

customElements.define(
    "my-prompt-input",
    makeWebComponent(myPromptInput, {
        attrs: ["value"],
        props: ["promptBuilder"],
        render,
    })
);
