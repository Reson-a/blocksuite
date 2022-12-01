import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  PropertyValueMap,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { DatabaseBlockModel, ISchema } from '../../database-model';
import { repeat } from 'lit/directives/repeat.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { styleMap } from 'lit/directives/style-map.js';
import type { DatabaseItemBlockModel } from '../../database-item-model';
import type { BlockHost } from '../../../__internal__';
import { FieldFactory } from '../../fields';
import type { IGalleryViewModel } from '.';

@customElement(`affine-gallery-card`)
class GalleryCard extends LitElement {
  static styles = css`
    .affine-gallery-card {
      box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
        rgb(15 15 15 / 10%) 0px 2px 4px;
      border-radius: 3px;
      padding: 8px 10px;
    }
  `;

  @property()
  model!: DatabaseBlockModel;

  @property()
  view!: IGalleryViewModel;

  @property()
  schema!: ISchema[];

  @property()
  item!: DatabaseItemBlockModel;

  render() {
    return html`<div class="affine-gallery-card">
      <slot></slot>
    </div>`;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.model, _changedProperties);
  }
}

export default GalleryCard;

declare global {
  interface HTMLElementTagNameMap {
    'affine-gallery-card': GalleryCard;
  }
}
