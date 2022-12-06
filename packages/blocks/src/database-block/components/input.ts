import { html, LitElement, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type Dictionary<T> = { [key: string]: T };

@customElement('affine-input')
class Input extends LitElement {
  static styles = css`
    .affine-input {
      display: inline-block;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: inherit;
      font-size: inherit;
      padding: 0 5px;
      border: none;
    }
    .affine-input:focus {
      outline: none;
      border-color: #6af;
    }
    .affine-input::placeholder {
      color: #ccc;
    }
    .affine-input:disabled {
      background-color: #f5f5f5;
      border-color: #eee;
    }
  `;

  @property()
  value!: string;

  @property()
  type!: string;

  @property()
  placeholder!: string;

  firstUpdated() {}

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    // if (_changedProperties.has('value'))
    //   this.quill?.setText(_changedProperties.get('value'));
  }

  render() {
    return html`<input
      class="affine-input"
      value=${this.value}
      type=${this.type}
      placeholder=${this.placeholder}
      @change=${this.handleChange}
    />`;
  }
  handleChange(e: any) {
    if (e.target.value == this.value) return;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: e.target.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default Input;

declare global {
  interface HTMLElementTagNameMap {
    'affine-input': Input;
  }
}
