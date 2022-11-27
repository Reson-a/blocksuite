import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { IFieldElement, Field } from '.';

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
      <quill-editor
        value=${NumberFieldElement.valueToRender(this.field)}
      ></quill-editor>
    </div>`;
  }
}

export default NumberFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    'affine-number-field': NumberFieldElement;
  }
}
