import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  PropertyValueMap,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { DatabaseBlockModel, ISchema } from '../../database-model.js';
import { repeat } from 'lit/directives/repeat.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { styleMap } from 'lit/directives/style-map.js';
import type { DatabaseItemBlockModel } from '../../database-item-model.js';
import type { BlockHost } from '../../../__internal__/index.js';
import { FieldFactory } from '../../fields/index.js';
import '../../components/input';
import '../card';
import type { IGalleryViewModel } from './index.js';

@customElement(`affine-gallery`)
class Gallery extends LitElement {
  static styles = css`
    .affine-gallery {
      display: grid;
      position: relative;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      padding: 16px 2px;
    }
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
  currentView!: IGalleryViewModel;

  static defaultHeight = 36;
  static defaultWidth = 150;

  render() {
    return html`<div class="affine-gallery">
      ${repeat(
        this.items,
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

export default Gallery;

declare global {
  interface HTMLElementTagNameMap {
    'affine-gallery': Gallery;
  }
}
