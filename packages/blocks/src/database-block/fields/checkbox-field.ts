import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

export type CheckboxField = boolean | undefined;
@customElement(`affine-checkbox-field`)
class CheckboxFieldElement extends LitElement {
  static styles = css`
    .affine-checkbox-field {
      padding: 0 8px;
    }
  `;

  @property()
  field!: CheckboxField;

  static valueToRender(field: CheckboxField) {
    return '';
  }

  static valueToCompare(field: CheckboxField) {
    return field;
  }

  render() {
    return html`<div
      class=${classMap({ 'affine-checkbox-field': true })}
      style=${styleMap({})}
    >
      <input
        type="checkbox"
        ?checked=${this.field}
        @change=${this.handleChange}
      />
    </div>`;
  }
  handleChange(e: any) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: e.target.checked,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default CheckboxFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    'affine-checkbox-field': CheckboxFieldElement;
  }
}
