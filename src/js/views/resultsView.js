import View from './View';
import previewView from './previewView';
class resultsView extends View {
  _parentElement = document.querySelector('.results');

  _message = 'Start by searching for a recipe or an ingredient. Have fun!';
  _errorMessage = 'No Recipes found for your query! Please try again.';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultsView();
