import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { DatabaseBlockModel } from '../database-model';
import type { IViewModel } from '../view';
import style from './style.css';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { FilterOperator, SortDirection } from '../utils';

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
        <button
          @click=${() => {
            const id = this.model.schemas[0].id;
            const filter = this.model.currentFilters.find(
              item => item.id == id
            );
            if (filter) {
              this.model.deleteFilter(id);
            } else this.model.addFilter();
          }}
        >
          筛选第一列不为空
        </button>
        <button
          @click=${() => {
            const id = this.model.schemas[1].id;
            const filter = this.model.currentFilters.find(
              item => item.id == id
            );
            if (filter) {
              this.model.deleteFilter(id);
            } else
              this.model.addFilter(undefined, {
                id,
                value: 5,
                operator: FilterOperator.GREATER_THAN,
              });
          }}
        >
          筛选第二列大于5
        </button>
        <button
          @click=${() => {
            if (this.currentView.groups?.length) {
              this.currentView.groups.forEach(group => {
                this.model.deleteGroup(group.id);
              });
            } else this.model.addGroup();
          }}
        >
          分组
        </button>
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
