import { makeWebComponent } from "/lib/function-web-components/index.js";

function myGreeting({ name = "You" }) {
    return `<p>Hello ${name}.</p>`;
}

customElements.define(
    "my-greeting",
    makeWebComponent(myGreeting, { attrs: ["name"] })
);
