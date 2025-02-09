import { customElement, property, query, state } from 'lit/decorators.js';
import { css, html, unsafeCSS } from 'lit';
import { createEvent, NonShadowLitElement } from '../../__internal__/index.js';
import style from './style.css?inline';
import { styleMap } from 'lit/directives/style-map.js';
import { SearchIcon } from './icons.js';

// TODO extract to a common list component
@customElement('lang-list')
export class LangList extends NonShadowLitElement {
  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  @state()
  filterText = '';

  @property()
  id!: string;

  @property({ type: String })
  selectedLanguage = '';

  @property()
  showLangList = 'hidden';

  @query('#filter-input')
  filterInput!: HTMLInputElement;

  @state()
  disposeTimer = 0;

  @property()
  delay = 150;

  static languages = [
    'TypeScript',
    'Rust',
    'Python',
    'Java',
    'C',
    'CPP',
    'JavaScript',
    'PHP',
    'Go',
    'Bash',
    'Swift',
    'Dart',
    'Delphi',
    'XML',
    '1c',
    'abnf',
    'accesslog',
    'actionscript',
    'ada',
    'angelscript',
    'apache',
    'applescript',
    'arcade',
    'arduino',
    'armasm',
    'asciidoc',
    'aspectj',
    'autohotkey',
    'autoit',
    'avrasm',
    'awk',
    'axapta',
    'basic',
    'bnf',
    'brainfuck',
    'cal',
    'capnproto',
    'ceylon',
    'clean',
    'clojure',
    'clojure-repl',
    'cmake',
    'coffeescript',
    'coq',
    'cos',
    'crmsh',
    'crystal',
    'csharp',
    'csp',
    'css',
    'd',
    'markdown',
    'diff',
    'django',
    'dns',
    'dockerfile',
    'dos',
    'dsconfig',
    'dts',
    'dust',
    'ebnf',
    'elixir',
    'elm',
    'ruby',
    'erb',
    'erlang-repl',
    'erlang',
    'excel',
    'fix',
    'flix',
    'fortran',
    'fsharp',
    'gams',
    'gauss',
    'gcode',
    'gherkin',
    'glsl',
    'gml',
    'golo',
    'gradle',
    'graphql',
    'groovy',
    'haml',
    'handlebars',
    'haskell',
    'haxe',
    'hsp',
    'http',
    'hy',
    'inform7',
    'ini',
    'irpf90',
    'isbl',
    'jboss-cli',
    'json',
    'julia',
    'julia-repl',
    'kotlin',
    'lasso',
    'latex',
    'ldif',
    'leaf',
    'less',
    'lisp',
    'livecodeserver',
    'livescript',
    'llvm',
    'lsl',
    'lua',
    'makefile',
    'mathematica',
    'matlab',
    'maxima',
    'mel',
    'mercury',
    'mipsasm',
    'mizar',
    'perl',
    'mojolicious',
    'monkey',
    'moonscript',
    'n1ql',
    'nestedtext',
    'nginx',
    'nim',
    'nix',
    'node-repl',
    'nsis',
    'objectivec',
    'ocaml',
    'openscad',
    'oxygene',
    'parser3',
    'pf',
    'pgsql',
    'php-template',
    'plaintext',
    'pony',
    'powershell',
    'processing',
    'profile',
    'prolog',
    'properties',
    'protobuf',
    'puppet',
    'purebasic',
    'python-repl',
    'q',
    'qml',
    'r',
    'reasonml',
    'rib',
    'roboconf',
    'routeros',
    'rsl',
    'ruleslanguage',
    'sas',
    'scala',
    'scheme',
    'scilab',
    'scss',
    'shell',
    'smali',
    'smalltalk',
    'sml',
    'sqf',
    'sql',
    'stan',
    'stata',
    'step21',
    'stylus',
    'subunit',
    'taggerscript',
    'yaml',
    'tap',
    'tcl',
    'thrift',
    'tp',
    'twig',
    'vala',
    'vbnet',
    'vbscript',
    'vbscript-html',
    'verilog',
    'vhdl',
    'vim',
    'wasm',
    'wren',
    'x86asm',
    'xl',
    'xquery',
    'zephir',
  ];

  protected updated() {
    if (this.showLangList !== 'hidden') {
      this.filterInput.focus();
    }
  }

  protected firstUpdated() {
    document.addEventListener('click', (e: MouseEvent) => {
      this._clickHandler(e);
    });
  }

  private _clickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      !target.closest('.container')?.closest(`[data-block-id="${this.id}"]`)
    ) {
      this._dispose();
    }
  }

  private _dispose() {
    this.dispatchEvent(createEvent('dispose', null));
    document.removeEventListener('click', this._clickHandler);
    this.filterText = '';
  }

  private _onLanguageClicked(language: string) {
    this.selectedLanguage = language;
    this.dispatchEvent(
      createEvent('selected-language-changed', {
        language: this.selectedLanguage ?? 'JavaScript',
      })
    );
    this._dispose();
  }

  render() {
    const filteredLanguages = LangList.languages.filter(language => {
      if (!this.filterText) {
        return true;
      }
      return language.toLowerCase().startsWith(this.filterText.toLowerCase());
    });

    if (this.showLangList === 'hidden') {
      return html``;
    }

    const styles = styleMap({
      display: 'flex',
      'padding-top': '8px',
      'padding-left': '4px',
    });

    return html`
      <div class="lang-list-container">
        <div style="${styles}">
          <div class="search-icon">${SearchIcon}</div>
          <input
            id="filter-input"
            type="text"
            placeholder="Search"
            value=${this.filterText}
            @keyup=${() => (this.filterText = this.filterInput?.value)}
          />
        </div>
        <div class="lang-list-button-container">
          ${filteredLanguages.map(
            language => html`
              <code-block-button
                width="100%"
                @click="${() => this._onLanguageClicked(language)}"
                class="lang-item"
              >
                ${language}
              </code-block-button>
            `
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-list': LangList;
  }

  interface HTMLElementEventMap {
    'selected-language-changed': CustomEvent<{ language: string }>;
    dispose: CustomEvent<null>;
  }
}
