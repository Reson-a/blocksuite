import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import style from './style.css';

import type { DatabaseBlockModel, ISchema } from '../../database-model';
import type { IGroup } from '../../utils';
import type { DatabaseItemBlockModel } from '../../database-item-model';

@customElement(`affine-table-row-group`)
class TableRowGroup extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property()
  model!: DatabaseBlockModel;

  @property()
  schemas!: ISchema[];

  @property()
  selected!: boolean;

  @property()
  hide!: boolean;

  @property()
  title!: string;

  @property()
  group!: IGroup;

  render() {
    return html`<div
      class=${classMap({ 'affine-table-row-group': true })}
      style=${styleMap({})}
    >
      <affine-table-cell>${this.title || ''}</affine-table-cell>
      <slot></slot>
      <button
        @click=${() => {
          const item = this.model.addItem(undefined, {
            // fields: { [this.group.id]: this.title },
          }) as DatabaseItemBlockModel;
          item.updateField(this.group.id, this.title);
        }}
      >
        +
      </button>
    </div> `;
  }
}

export default TableRowGroup;

declare global {
  interface HTMLElementTagNameMap {
    'affine-table-row-group': TableRowGroup;
  }
}
