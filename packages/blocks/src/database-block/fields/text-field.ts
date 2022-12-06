import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
export type TextField = string;
@customElement(`affine-text-field`)
class TextFieldElement extends LitElement {
  static styles = css``;

  @property()
  field!: TextField;

  static valueToRender(field: TextField) {
    return field;
  }
  static valueToCompare(field: TextField) {
    return field;
  }

  render() {
    return html`<div
      class=${classMap({ 'affine-text-field': true })}
      style=${styleMap({})}
    >
      <affine-input
        value=${TextFieldElement.valueToRender(this.field)}
      ></affine-input>
    </div>`;
  }
}

export default TextFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    'affine-text-field': TextFieldElement;
  }
}
