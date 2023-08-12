import View from './View'; // parent View class

import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const GoToPage = +btn.dataset.goto;
      handler(GoToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPages
    );
    // return numPages;

    if (curPage === 1 && numPages > 1) {
      return this.#generateMarkupButton('right');
    }
    // Last page
    if (curPage === numPages && numPages > 1)
      return this.#generateMarkupButton('left');

    if (curPage < numPages) {
      return `${this.#generateMarkupButton(
        'left'
      )} ${this.#generateMarkupButton('right')}`;
    }
    return '';
  }
  #generateMarkupButton(directions) {
    //prettier-ignore
    return `
          <button data-goto="${directions === 'left' ? this._data.page - 1 : this._data.page + 1}"class="btn--inline pagination__btn--${directions === 'left' ? 'prev' : 'next' }"><svg class="search__icon"><use href="${icons}#icon-arrow-${directions}"></use></svg><span>Page ${directions === 'left' ? this._data.page - 1 : this._data.page + 1}</span> </button> `;
  }
}

export default new paginationView();
