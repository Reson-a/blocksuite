import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import style from './style.css';
import type { DatabaseItemBlockModel } from '../../database-item-model';
import type { ISchema } from '../../database-model';

@customElement(`affine-table-row-group`)
class TableRowGroup extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property()
  model!: DatabaseItemBlockModel;

  @property()
  schemas!: ISchema[];

  @property()
  selected!: boolean;

  @property()
  id!: string;

  render() {
    return html`<div
      class=${classMap({ 'affine-table-row-group': true })}
      style=${styleMap({})}
    >
      <slot></slot>
    </div> `;
  }
}

export default TableRowGroup;

declare global {
  interface HTMLElementTagNameMap {
    'affine-table-row-group': TableRowGroup;
  }
}
