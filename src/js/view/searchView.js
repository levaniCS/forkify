import { elements } from './base';

export const getInput = () => elements.searchInput.value; // input query value

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightedSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active');
  });
  document
    .querySelector(`a[href*="#${id}"]`)
    .classList.add('results__link--active'); //.results__link
};

////////////////////////////////////////////// MAKING TEXT CHARACTERS INVISIBLE IF OVERFLOW
// 'pasta with tomato and spomach'
// acc: 0  -> acc+cur.lengtj = 5  -> newTitle = ['Pasta']
// acc: 5  -> acc+cur.lengtj = 5+4  -> newTitle = ['Pasta','with']
// acc: 9  -> acc+cur.lengtj = 9+6  -> newTitle = ['Pasta','with','tomato']
// acc: 15  -> acc+cur.lengtj = 15+3  -> newTitle = ['Pasta','with','tomato']
export const limitRecipieTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    // return the final result
    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipieTitle(
                      recipe.title
                    )}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

///////////////////////////////////////////// PAGINATION
// type: prev or next
const createButton = (page, type) => `
      <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
          <svg class="search__icon">
              <use href="img/icons.svg#icon-triangle-${
                type === 'prev' ? 'left' : 'right'
              }"></use>
          </svg>
      </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;

  if (page === 1 && pages > 1) {
    // button to go to next page only
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}`;
    // both btns
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev');
    // button to go to previous page only
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of curr pages
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe); // automaticaly: el => renderRecipe(el)

  renderButtons(page, recipes.length, resPerPage);
};
