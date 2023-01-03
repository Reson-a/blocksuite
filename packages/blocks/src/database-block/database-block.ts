import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DatabaseBlockModel } from './database-model.js';
import {
  BlockChildrenContainer,
  BLOCK_ID_ATTR,
  type BlockHost,
} from '../__internal__/index.js';
import style from './style.css?inline';
import { DataBaseViewType } from './view/index.js';
import './toolbar';

@customElement('database-block')
export class DatabaseBlockComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property({
    hasChanged() {
      return true;
    },
  })
  model!: DatabaseBlockModel;

  @property()
  host!: BlockHost;

  // disable shadow DOM to workaround quill
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.model.propsUpdated.on(() => this.requestUpdate());
    this.model.childrenUpdated.on(() => this.requestUpdate());
  }

  render() {
    this.setAttribute(BLOCK_ID_ATTR, this.model.id);

    const childrenContainer = BlockChildrenContainer(
      this.model,
      this.host,
      () => this.requestUpdate()
    );

    return html`
      <div
        class="affine-database-block-container"
        @mousedown=${(e: any) => e.stopPropagation()}
        @mouseup=${(e: any) => e.stopPropagation()}
      >
        <affine-database-toolbar
          .model=${this.model}
          .views=${this.model.views}
          .currentView=${this.model.currentView}
        ></affine-database-toolbar>
        ${this.renderView()}${childrenContainer}
      </div>
    `;
  }

  renderView() {
    switch (this.model.currentView?.type) {
      case DataBaseViewType.Table:
        return html`<affine-table
          .model=${this.model}
          .host=${this.host}
          .items=${this.model.getItems(true)}
          .currentView=${this.model.currentView}
          .schemas=${this.model.schemas}
        ></affine-table>`;
      case DataBaseViewType.Gallery:
        return html`<affine-gallery
          .model=${this.model}
          .host=${this.host}
          .items=${this.model.getItems()}
          .currentView=${this.model.currentView}
          .schemas=${this.model.schemas}
        ></affine-gallery>`;
      case DataBaseViewType.Board:
        return html`<affine-board
          .model=${this.model}
          .host=${this.host}
          .items=${this.model.getItems(true)}
          .currentView=${this.model.currentView}
          .schemas=${this.model.schemas}
        ></affine-board>`;
      default:
        return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'database-block': DatabaseBlockComponent;
  }
}
