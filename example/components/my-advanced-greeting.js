import {
    makeWebComponent,
    useState,
} from "/lib/function-web-components/index.js";
import { html, render } from "/lib/lit-html/lit-html.js";
import "./my-prompt-input.js";

function myAdvancedGreeting({ givenName }) {
    const [surname, setSurname] = useState("...");
    const onSurnameChange = e => {
        setSurname(e.detail);
    };

    return html`
        <p>
            Hello ${givenName}
            <my-prompt-input
                value="${surname}"
                .promptBuilder=${() => `Current name: ${givenName} ${surname}`}
                @change=${onSurnameChange}
            ></my-prompt-input
            >.
        </p>
    `;
}

customElements.define(
    "my-advanced-greeting",
    makeWebComponent(myAdvancedGreeting, { attrs: ["givenName"], render })
);
