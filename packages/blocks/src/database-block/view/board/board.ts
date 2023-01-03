import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { DatabaseBlockModel, ISchema } from '../../database-model.js';
import { repeat } from 'lit/directives/repeat.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { styleMap } from 'lit/directives/style-map.js';
import type { DatabaseItemBlockModel } from '../../database-item-model.js';
import type { BlockHost } from '../../../__internal__/index.js';
import { FieldFactory } from '../../fields/index.js';
import '../../components/input';
import type { IBoardViewModel } from './index.js';
import type { IGroupItem } from '../../utils/index.js';

@customElement(`affine-board`)
class Board extends LitElement {
  static styles = css`
    .affine-board {
      display: flex;
      padding: 16px 2px;
    }
    .affine-board-group {
    }
    .affine-board-item-count {
      font-size: 14px;
      color: #ccc;
    }
  `;

  @property()
  model!: DatabaseBlockModel;

  @property()
  host!: BlockHost;

  @property()
  schemas!: ISchema[];

  @property()
  items!: IGroupItem[];

  @property()
  currentView!: IBoardViewModel;

  static defaultHeight = 36;
  static defaultWidth = 150;

  render() {
    return html`<div class="affine-board">
      ${repeat(
        this.items,
        groupItem => groupItem.id,
        groupItem => html`<div class="affine-board-group">
          <div>
            <span class="affine-board-title">${groupItem.id || 'No Type'}</span>
            <span class="affine-board-item-count"
              >${groupItem.items.length}</span
            >
          </div>
          ${repeat(
            groupItem.items,
            item => item.id,
            item => html`<affine-card .item=${item}>
              ${repeat(
                this.schemas,
                schema => schema.id,
                schema =>
                  html` ${FieldFactory.renderField(
                    schema.type,
                    item.fields[schema.id],
                    e => {
                      this.handleFieldChange(e, item, schema.id);
                    }
                  )}`
              )}
            </affine-card>`
          )}
          <button
            @click=${() => {
              const item = this.model.addItem({
                // fields: { [this.group.id]: this.title },
              }) as DatabaseItemBlockModel;
              item.updateField(groupItem.group.id, groupItem.id);
            }}
          >
            +
          </button>
        </div>`
      )}
      <slot></slot>
    </div>`;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.model, _changedProperties);
  }

  handleSchemaChange(e: any, id: string) {
    this.model.updateSchema(id, { name: e.detail.value });
  }

  handleFieldChange(e: any, item: DatabaseItemBlockModel, id: string) {
    item.updateField(id, e.detail.value);
  }
}

export default Board;

declare global {
  interface HTMLElementTagNameMap {
    'affine-board': Board;
  }
}
