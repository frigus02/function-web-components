import { makeWebComponent } from "/lib/functional-web-components.js";

function myHeadline({ level = 1 }) {
    return `
        <h${level}>
            <slot></slot>
        </h${level}>
    `;
}

myHeadline.observedAttributes = ["level"];

customElements.define("my-headline", makeWebComponent(myHeadline));
