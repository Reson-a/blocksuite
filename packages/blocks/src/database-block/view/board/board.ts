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
import type { DatabaseItemBlockModel } from '../../database-item-model';
import type { BlockHost } from '../../../__internal__';
import { FieldFactory } from '../../fields';
import '../../components/quill-editor';

@customElement(`affine-board`)
class Board extends LitElement {
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
  currentView!: IBoardViewModel;

  static defaultRowHeight = 36;
  static defaultColWidth = 150;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'board');
    }
    super.connectedCallback();
  }

  render() {
    return html`<div class="affine-board">
      ${this.renderBoardHead()}${this.renderBoardBody()}${this.renderBoardFooter()}
      <slot></slot>
    </div>`;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.model, _changedProperties);
  }

  getRowHeight(itemId: string) {
    return this.currentView.row[itemId]?.height || Board.defaultRowHeight;
  }

  getColWidth(fieldId: string) {
    return this.currentView.col[fieldId]?.width || Board.defaultColWidth;
  }

  renderBoardHead() {
    return html`<affine-board-row .height=${Board.defaultRowHeight}
      >${repeat(
        this.schemas,
        schema =>
          html`<affine-board-cell .width=${this.getColWidth(schema.id)}
            ><quill-editor
              value=${schema.name}
              @change=${e => this.handleSchemaChange(e, schema.id)}
            ></quill-editor>
          </affine-board-cell>`
      )}
      <button @click=${() => this.model.addSchema()}>+</button>
    </affine-board-row>`;
  }

  renderBoardBody() {
    return html`
      ${repeat(
        this.items,
        item =>
          html`<affine-board-row
            .model=${item}
            .schemas=${this.schemas}
            .height=${this.getRowHeight(item.id)}
            >${repeat(
              this.schemas,
              schema =>
                html`<affine-board-cell .width=${this.getColWidth(schema.id)}>
                  <!-- <rich-text .host=${this
                    .host} .model=${item}></rich-text> -->

                  ${FieldFactory.renderField(
                    schema.type,
                    item.fields[schema.id],
                    e => {
                      this.handleFieldChange(e, item, schema.id);
                    }
                  )}
                </affine-board-cell>`
            )}</affine-board-row
          >`
      )}
    `;
  }

  renderBoardFooter() {
    return html`<div class="affine-board-footer">
      <button @click=${() => this.model.addItem({})}>+</button>
    </div>`;
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
