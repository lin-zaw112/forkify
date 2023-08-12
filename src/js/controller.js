import 'core-js/stable';
import 'regenerator-runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // init View state
    recipeView.renderMessage();
    if (!id) return;
    recipeView.renderSpinner();
    // 0 Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // load and update bookmark
    bookmarkView.update(model.state.bookmarks);
    // 1 loading recipe
    await model.loadRecipe(id);
    // (2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1 Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2 Load search results
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // 3 render results
    resultsView.render(model.getSearchResultsPage());

    // 4 initial pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    recipeView.renderError(err.message);
  }
};
const controlPagination = function (GoToPage) {
  resultsView.update(model.getSearchResultsPage(GoToPage));
  // 4 initial pagination buttons
  PaginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //  Update the recipe servings ( in state )
  model.updateServings(newServings);
  //  Update the recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1 add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state);
  // 2 Update recipe view
  recipeView.update(model.state.recipe);
  // render bookmark
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //  Render recipe
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();
    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);
    // Change ID in URl
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('###', err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
