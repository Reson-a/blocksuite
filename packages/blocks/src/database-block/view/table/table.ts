import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  PropertyValueMap,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './style.css';
import type { DatabaseBlockModel, ISchema } from '../../database-model';
import { repeat } from 'lit/directives/repeat.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { styleMap } from 'lit/directives/style-map.js';
import type { ITableViewModel } from '.';
import { DatabaseItemBlockModel } from '../../database-item-model';
import type { BlockHost } from '../../../__internal__';
import { FieldFactory } from '../../fields';
import '../../components/input';
import type { IGroupItem } from '../../utils';

@customElement(`affine-table`)
class Table extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property()
  model!: DatabaseBlockModel;

  @property()
  host!: BlockHost;

  @property()
  schemas!: ISchema[];

  @property()
  items!: Array<IGroupItem | DatabaseItemBlockModel>;

  @property()
  currentView!: ITableViewModel;

  static defaultRowHeight = 36;
  static defaultColWidth = 150;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'table');
    }
    super.connectedCallback();
  }

  render() {
    return html`<div class="affine-table">
      ${this.renderTableHead()}${this.renderTableBody()}${this.renderTableFooter()}
      <slot></slot>
    </div>`;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.model, _changedProperties);
  }

  getRowHeight(itemId: string) {
    return this.currentView.row[itemId]?.height || Table.defaultRowHeight;
  }

  getColWidth(fieldId: string) {
    return this.currentView.col[fieldId]?.width || Table.defaultColWidth;
  }

  renderTableHead() {
    return html`<affine-table-row .height=${Table.defaultRowHeight}
      >${repeat(
        this.schemas,
        schema =>
          html`<affine-table-cell .width=${this.getColWidth(schema.id)}
            ><affine-input
              value=${schema.name}
              @change=${(e: any) => this.handleSchemaChange(e, schema.id)}
            ></affine-input>
          </affine-table-cell>`
      )}
      <button @click=${() => this.model.addSchema()}>+</button>
    </affine-table-row>`;
  }

  renderTableBody() {
    return html`
      ${repeat(
        this.items,
        item => item.id,
        item => {
          if (item instanceof DatabaseItemBlockModel)
            return this.renderRow(item);
          else return this.renderRowGroup(item);
        }
      )}
    `;
  }

  renderRow(item: DatabaseItemBlockModel) {
    return html`<affine-table-row
      .model=${item}
      .schemas=${this.schemas}
      .height=${this.getRowHeight(item.id)}
      >${repeat(
        this.schemas,
        schema => schema.id,
        schema =>
          html`<affine-table-cell .width=${this.getColWidth(schema.id)}>
            <!-- <rich-text .host=${this.host} .model=${item}></rich-text> -->

            ${FieldFactory.renderField(
              schema.type,
              item.fields[schema.id],
              e => {
                this.handleFieldChange(e, item, schema.id);
              }
            )}
          </affine-table-cell>`
      )}</affine-table-row
    >`;
  }

  renderRowGroup(groupItem: IGroupItem) {
    return html`<affine-table-row-group
      .title=${groupItem.id}
      .model=${this.model}
      .group=${groupItem.group}
    >
      ${repeat(
        groupItem.items,
        item => item.id,
        item => html`${this.renderRow(item)}`
      )}
    </affine-table-row-group> `;
  }

  renderTableFooter() {
    if (this.model.hasGroup()) return;
    return html`<div class="affine-table-footer">
      <button @click=${() => this.model.addItem()}>+</button>
    </div>`;
  }

  handleSchemaChange(e: any, id: string) {
    this.model.updateSchema(id, { name: e.detail.value });
  }

  handleFieldChange(e: any, item: DatabaseItemBlockModel, id: string) {
    item.updateField(id, e.detail.value);
  }
}

export default Table;

declare global {
  interface HTMLElementTagNameMap {
    'affine-table': Table;
  }
}
