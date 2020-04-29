import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';

import { elements, renderLoader, clearLoader } from './view/base';

/** Global STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 **/
const state = {};

/**
 *  SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. GET query from view
  const query = searchView.getInput();

  if (query) {
    // 2. Create search obj and add to state
    state.search = new Search(query);

    //3. Prepare UI for results
    // clear input field and search list for another search
    searchView.clearInput();
    searchView.clearResults();

    renderLoader(elements.searchRes);

    try {
      // 4. Search for recipes
      await state.search.getResults();

      //5. render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert('Something wrong with the search...');
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline'); // clothest method returns closest ancestor of the curr element

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); /// dataset.goto refers => [ data-goto ] => attribute which we paste in createbutton (button tag)
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 *  RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Gett ID from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightedSelected(id);

    // Create new recipe obj
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse Ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render Recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert('Error processing recipe !');
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/**
 *  LIST CONTROLLER
 */
const controlList = () => {
  // CREATE a new list if there is not yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // handle delete event
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // deletee from state
    state.list.deleteItem(id);

    // delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value); // element that was clicked

    state.list.updateCount(id, val);
  }
});

/**
 *  RECIPE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;

  // user has not yet liked curr recipe
  if (!state.likes.isLiked(currentID)) {
    // add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // TOGGLE like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    //user has liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);

    // TOGGLE like button
    likesView.toggleLikeBtn(false);

    // Remove like to UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page loads
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  // btn-decrease or/and any child of btn-decrease (* -asterix)
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller\
    controlLike();
  }
});
