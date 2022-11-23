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
import type { DatabaseItemBlockModel } from '../../database-item-model';
import type { BlockHost } from '../../../__internal__';
import { FieldFactory } from '../../fields';
import '../../components/quill-editor';

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
  items!: DatabaseItemBlockModel[];

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
            ><quill-editor
              value=${schema.name}
              @text-change=${e => this.handleSchemaTextChange(e, schema.id)}
            ></quill-editor>
          </affine-table-cell>`
      )}
      <button @click=${() => this.model.addSchema()}>+</button>
    </affine-table-row>`;
  }

  renderTableBody() {
    return html`
      ${repeat(
        this.items,
        item =>
          html`<affine-table-row
            .model=${item}
            .schemas=${this.schemas}
            .height=${this.getRowHeight(item.id)}
            >${repeat(
              this.schemas,
              schema =>
                html`<affine-table-cell .width=${this.getColWidth(schema.id)}>
                  <!-- <rich-text .host=${this
                    .host} .model=${item}></rich-text> -->
                  <quill-editor
                    value=${FieldFactory.render(
                      schema.type,
                      item.fields[schema.id]
                    )}
                    @text-change=${e =>
                      this.handleFieldTextChange(e, item, schema.id)}
                  ></quill-editor>
                </affine-table-cell>`
            )}</affine-table-row
          >`
      )}
    `;
  }

  renderTableFooter() {
    return html`<div class="affine-table-footer">
      <button @click=${() => this.model.addItem({})}>+</button>
    </div>`;
  }

  handleSchemaTextChange(e: any, id: string) {
    console.log(e);
    this.model.updateSchema(id, { name: e.detail.value });
  }

  handleFieldTextChange(e: any, item: DatabaseItemBlockModel, id: string) {
    console.log(e);
    item.updateField(id, e.detail.value);
  }
}

export default Table;

declare global {
  interface HTMLElementTagNameMap {
    'affine-table': Table;
  }
}
