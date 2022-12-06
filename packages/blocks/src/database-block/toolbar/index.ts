import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { DatabaseBlockModel } from '../database-model';
import type { IViewModel } from '../view';
import style from './style.css';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { SortDirection } from '../utils';

@customElement(`affine-database-toolbar`)
class ToolBar extends LitElement {
  static styles = css`
    ${unsafeCSS(style)}
  `;

  @property()
  model!: DatabaseBlockModel;
  @property()
  views!: IViewModel[];
  @property()
  currentView!: IViewModel;

  render() {
    return html`<div class="affine-database-toolbar">
      <div class="view-list">
        ${repeat(
          this.views,
          view =>
            html`<span
              class=${classMap({
                'view-name': true,
                active: this.currentView.id == view.id,
              })}
              @click=${() => {
                this.model.setActiveView(view.id);
              }}
              >${view.name}</span
            >`
        )}
        <button
          @click=${() => {
            this.model.addView();
          }}
        >
          +
        </button>
      </div>
      <div>
        <button
          @click=${() => {
            const sort = this.model.currentSorts[0];
            if (sort) {
              this.model.updateSort(sort.id, {
                direction:
                  sort.direction == SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC,
              });
            } else this.model.addSort();
          }}
        >
          排序
        </button>
        <button>筛选</button>
        <button>分组</button>
      </div>

      <slot></slot>
    </div>`;
  }
}

export default ToolBar;

declare global {
  interface HTMLElementTagNameMap {
    'affine-database-toolbar': ToolBar;
  }
}
