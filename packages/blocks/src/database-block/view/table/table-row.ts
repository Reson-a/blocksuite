import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import style from './style.css';
import type { DatabaseItemBlockModel } from '../../database-item-model';
import type { ISchema } from '../../database-model';

@customElement(`affine-table-row`)
class TableRow extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property()
  model!: DatabaseItemBlockModel;

  @property()
  schemas!: ISchema[];

  @property()
  height!: number;

  @property()
  selected!: boolean;

  render() {
    return html`<div
      class=${classMap({ 'affine-table-row': true })}
      style=${styleMap({
        height: this.height + 'px',
        lineHeight: this.height + 'px',
      })}
    >
      <slot></slot>
    </div> `;
  }
}

export default TableRow;

declare global {
  interface HTMLElementTagNameMap {
    'affine-table-row': TableRow;
  }
}
