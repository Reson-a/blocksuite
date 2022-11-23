import { html, LitElement, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Quill, { QuillOptionsStatic } from 'quill';

export type Dictionary<T> = { [key: string]: T };

@customElement('quill-editor')
class QuillEditor extends LitElement {
  static styles = css`
    p {
      margin: 0;
    }
    .ql-editor {
      padding: 0 8px;
    }
  `;
  @property()
  modules: Dictionary<any> = {};

  @property()
  options: QuillOptionsStatic | undefined;

  @property()
  value!: string;

  quill!: Quill;

  firstUpdated() {
    for (const [key, value] of Object.entries(this.modules)) {
      Quill.register(key, value);
    }

    this.quill = new Quill(
      this.shadowRoot?.getElementById('editor') as Element,
      this.options
    );

    if (this.value) {
      this.quill?.setText(this.value);
    }

    this.quill.on('text-change', (delta, oldContents, source) =>
      this.dispatchEvent(
        new CustomEvent('text-change', {
          detail: {
            value: this.quill.getText(),
            delta,
            oldContents,
            source,
          },
          bubbles: true,
          composed: true,
        })
      )
    );
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(_changedProperties);
    // if (_changedProperties.has('value'))
    //   this.quill?.setText(_changedProperties.get('value'));
  }

  render() {
    return html`<div
      id="editor"
      style="flex: 1;"
      @click=${() => this.quill?.focus()}
    >
      <slot></slot>
    </div>`;
  }
}

export default QuillEditor;

declare global {
  interface HTMLElementTagNameMap {
    'quill-editor': QuillEditor;
  }
}
