import { html, render } from "/lib/lit-html/lit-html.js";
import { makeWebComponent } from "/lib/function-web-components/index.js";

function myHeadline({ level = "1" }) {
    if (level === "3") {
        return html`
            <h3><slot></slot></h3>
        `;
    } else if (level === "2") {
        return html`
            <h2><slot></slot></h2>
        `;
    } else {
        return html`
            <h1><slot></slot></h1>
        `;
    }
}

myHeadline.props = ["level"];

customElements.define("my-headline", makeWebComponent(myHeadline, render));
