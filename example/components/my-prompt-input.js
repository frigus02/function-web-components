import { makeWebComponent } from "/lib/function-web-components/index.js";
import { html, render } from "/lib/lit-html/lit-html.js";

function myPromptInput({ value, promptBuilder }) {
    // automatically dispatches "value-change" event
    // const setValue = usePropertySetter("value");
    // const setValue = usePropertySetter("value", {
    //     triggerRender: true,
    //     dispatchEvent: true,
    //     eventName: "change",
    // });

    //const dispatchEvent = useEventDispatcher();

    const changeValue = () => {
        const response = prompt(
            promptBuilder ? promptBuilder() : "Enter new value:"
        );
        if (response) {
            // TODO: set value
            // setValue(response);
            //this.value = response;
            // TODO: dispatch event
            //this.dispatchEvent(new CustomEvent("change", { detail: response }));
            // dispatchEvent(new CustomEvent("change", { detail: response }));
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
