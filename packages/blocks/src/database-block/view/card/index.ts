import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { DatabaseBlockModel, ISchema } from '../../database-model.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { styleMap } from 'lit/directives/style-map.js';
import type { DatabaseItemBlockModel } from '../../database-item-model.js';
import type { IViewModel } from '../index.js';

@customElement(`affine-card`)
class Card extends LitElement {
  static styles = css`
    .affine-card {
      box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
        rgb(15 15 15 / 10%) 0px 2px 4px;
      border-radius: 3px;
      padding: 8px 10px;
      margin-bottom: 16px;
      margin-right: 16px;
    }
  `;

  @property()
  model!: DatabaseBlockModel;

  @property()
  view!: IViewModel;

  @property()
  schema!: ISchema[];

  @property()
  item!: DatabaseItemBlockModel;

  render() {
    return html`<div class="affine-card">
      <slot></slot>
    </div>`;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.model, _changedProperties);
  }
}

export default Card;

declare global {
  interface HTMLElementTagNameMap {
    'affine-card': Card;
  }
}
