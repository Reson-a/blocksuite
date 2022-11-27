import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { IFieldElement, Field } from '.';

export type SelectField =
  | {
      options: string[];
      selected: number[];
      multi?: boolean;
    }
  | undefined;
@customElement(`affine-select-field`)
class SelectFieldElement extends LitElement {
  static styles = css`
    .affine-select-field {
      padding: 0 8px;
    }
  `;

  @property()
  field!: SelectField;

  getDefaultField() {
    return {
      multi: false,
      options: ['yes', 'no'],
      selected: [0],
    };
  }

  static valueToRender(field: SelectField) {
    if (!field) return '';
    return field.options[field.selected[0]] || '';
  }

  static valueToCompare(field: SelectField) {
    if (!field) return '';
    return field.selected[0];
  }

  render() {
    const field = this.field || this.getDefaultField();
    return html`<div
      class=${classMap({ 'affine-select-field': true })}
      style=${styleMap({})}
    >
      <select
        ${field.multi ? 'multiple' : ''}
        @change=${e => this.handleChange(e)}
      >
        ${repeat(
          field.options,
          (option, index) =>
            html`
              <option
                ${field.selected.includes(index) ? 'selected' : ''}
                value=${option}
                data-index=${index}
              >
                ${option}
              </option>
            `
        )}
      </select>
    </div>`;
  }
  handleChange(e) {
    const field = this.field || this.getDefaultField();
    const selected = [e.target.selectedIndex];
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: { ...field, selected },
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default SelectFieldElement;

declare global {
  interface HTMLElementTagNameMap {
    'affine-select-field': SelectFieldElement;
  }
}
