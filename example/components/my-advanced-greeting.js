import {
    makeWebComponent,
    useState,
} from "/lib/function-web-components/index.js";
import { html, render } from "/lib/lit-html/lit-html.js";

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
