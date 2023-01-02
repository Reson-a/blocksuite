import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import style from './style.css?inline';

@customElement(`affine-table-cell`)
class TableCell extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property()
  width!: number;

  render() {
    return html`<div
      class=${classMap({ 'affine-table-cell': true })}
      style=${styleMap({
        width: this.width + 'px',
      })}
    >
      <slot></slot>
    </div>`;
  }
}

export default TableCell;

declare global {
  interface HTMLElementTagNameMap {
    'affine-table-cell': TableCell;
  }
}
