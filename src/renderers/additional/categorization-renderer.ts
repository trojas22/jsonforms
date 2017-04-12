import {Categorization, Category} from '../../models/uischema';
import {Renderer} from '../../core/renderer';
import {JsonFormsRenderer} from '../renderer.util';
import {JsonForms} from '../../json-forms';
import {uiTypeIs, rankWith} from '../../core/testers';

@JsonFormsRenderer({
  selector: 'jsonforms-categorization',
  tester: rankWith(1, uiTypeIs('Categorization'))
})
class CategorizationRenderer extends Renderer {
  private master: HTMLElement;
  private detail: HTMLElement;
  private selected: HTMLLIElement;

  constructor() {
    super();
  }

  dispose(): void {
    // Do nothing
  }
  render(): HTMLElement {
    let div = document.createElement('div');
    div.className = 'jsf-categorization';

    this.master = document.createElement('div');
    this.master.className = 'jsf-categorization-master';
    div.appendChild(this.master);

    this.detail = document.createElement('div');
    this.detail.className = 'jsf-categorization-detail';
    div.appendChild(this.detail);

    this.appendChild(div);
    this.renderFull();
    return this;
  }

  private renderFull() {
    this.renderMaster();
    const controlElement = <Categorization> this.uischema;
    const result = this.findFirstCategory(controlElement,
      <HTMLUListElement>this.master.firstChild);
    this.renderDetail(result.category, result.li);
  }
  private findFirstCategory(categorization: Categorization, parent: HTMLUListElement):
    {category: Category, li: HTMLLIElement} {
    let firstCategory: Category;
    if (categorization.elements === undefined || categorization.elements.length === 0) {
      return null;
    }
    const category = categorization.elements[0];
    if (isCategorization(category)) {
      return this.findFirstCategory(category, <HTMLUListElement> parent.firstChild.lastChild);
    }
    return {category: category, li: <HTMLLIElement>parent.firstChild};
  }
  private renderMaster() {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const categorization = <Categorization> this.uischema;
    const ul = this.createCategorizationList(categorization);
    this.master.appendChild(ul);
  }
  private createCategorizationList(categorization: Categorization): HTMLUListElement {
    const ul = document.createElement('ul');
    categorization.elements.forEach(category => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = category.label;
      li.appendChild(span);
      // const div = document.createElement('div');
      // div.className = 'jsf-category-entry';
      // const span = document.createElement('span');
      // span.className = 'jsf-category-label';
      // span.innerText
      if (isCategorization(category)) {
        const innerUl = this.createCategorizationList(category);
        innerUl.className = 'jsf-category-subcategories';
        li.classList.add('jsf-category-group');
        li.appendChild(innerUl);
      } else {
        li.onclick = (ev: Event) => this.renderDetail(category, li);
      }
      ul.appendChild(li);
    });
    return ul;
  }
  private renderDetail(category: Category, li: HTMLLIElement) {
    if (this.detail.lastChild !== null) {
      this.detail.removeChild(this.detail.lastChild);
    }
    if (this.selected !== undefined) {
      this.selected.classList.toggle('selected');
    }
    li.classList.toggle('selected');
    this.selected = li;

    const wrapper = document.createElement('div');
    category.elements.forEach(child => {
      const jsonForms = <JsonForms>document.createElement('json-forms');
      jsonForms.data = this.dataService.getValue({type: 'Control', scope: {$ref: '#'}});
      jsonForms.uiSchema = child;
      jsonForms.dataSchema = this.dataSchema;
      wrapper.appendChild(jsonForms);
    });
    this.detail.appendChild(wrapper);
  }
}

function isCategorization(category: Category | Categorization): category is Categorization {
    return category.type === 'Categorization';
}