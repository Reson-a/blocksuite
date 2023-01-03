import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

export type NumberField = number | undefined;

@customElement(`affine-number-field`)
class NumberFieldElement extends LitElement {
  static styles = css``;

  @property()
  field!: NumberField;

  static valueToRender(field: NumberField) {
    if (isNaN(field as number)) return '';
    return field + '';
  }

  static valueToCompare(field: NumberField) {
    return field;
  }

  render() {
    return html`<div
      class=${classMap({ 'affine-number-field': true })}
      style=${styleMap({})}
    >
      <affine-input
        value=${NumberFieldElement.valueToRender(this.field)}
        type="number"
      ></affine-input>
    </div>`;
  }
}

export default NumberFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    'affine-number-field': NumberFieldElement;
  }
}
