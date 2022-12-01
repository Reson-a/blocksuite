import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

export type DateField = number | undefined;
@customElement(`affine-date-field`)
class DateFieldElement extends LitElement {
  static styles = css``;

  @property()
  field!: DateField;

  static valueToRender(field: DateField) {
    if (!field) return '';
    return new Date(field).toLocaleDateString();
  }

  static valueToCompare(field: DateField) {
    return field;
  }

  render() {
    return html`<div
      class=${classMap({ 'affine-date-field': true })}
      style=${styleMap({})}
    >
      <affine-input
        value=${DateFieldElement.valueToRender(this.field)}
      ></affine-input>
    </div>`;
  }
}

export default DateFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    'affine-date-field': DateFieldElement;
  }
}
