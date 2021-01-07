const searchClient = algoliasearch('08KMSERF1B', '96b7ec122afe6711386467472aaf7a44');

const search = instantsearch({
  indexName: 'Project',
  searchClient,
});

const renderHits = (renderOptions, isFirstRender) => {
  const {
    hits,
    widgetParams
  } = renderOptions;

  widgetParams.container.innerHTML = `
      ${hits
      .map(
        item =>
          `
                        <div>
                            <h3 class="text-lg md:text-2xl text-gray-200 text-left font-semibold font-heading">
                                ${instantsearch.highlight({ attribute: 'title', hit: item })}
                            </h3>
                            <div class="truncate mt-2">
                                <a class="text-gray-200 underline" href="${item.url}" target="_blank">
                                    ${item.url}
                                </a>
                            </div>
                            <div class="mt-2 px-3 py-1 text-sm bg-purple-500 rounded-full text-gray-100 font-bold break-words">
                                ${instantsearch.highlight({ attribute: 'technology', hit: item })}
                            </div>
                        </div>
                        `
      )
      .join('')}
  `;
};

const customHits = instantsearch.connectors.connectHits(renderHits);

// Create a render function
const renderSearchBox = (renderOptions, isFirstRender) => {
  const {
    query,
    refine,
    clear,
    isSearchStalled,
    widgetParams
  } = renderOptions;

  if (isFirstRender) {
    const input = document.createElement('input');
    input.classList.add('rounded-md', 'shadow-lg', 'w-full', 'py-3', 'px-5', 'text-gray-400', 'bg-white', 'bg-opacity-20', 'placeholder-white', 'placeholder-opacity-40', 'focus:outline-none', 'focus:ring-4', 'focus:ring-white', 'focus:ring-opacity-30')
    input.placeholder = '🔎 Python website...';

    const loadingIndicator = document.createElement('span');
    loadingIndicator.textContent = 'Loading...';

    input.addEventListener('input', event => {
      refine(event.target.value);
    });

    widgetParams.container.appendChild(input);
    widgetParams.container.appendChild(loadingIndicator);
  }

  widgetParams.container.querySelector('input').value = query;
  widgetParams.container.querySelector('span').hidden = !isSearchStalled;
};

// create custom widget
const customSearchBox = instantsearch.connectors.connectSearchBox(
  renderSearchBox
);

// Create the render function
const renderPagination = (renderOptions, isFirstRender) => {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = renderOptions;

  const container = document.querySelector('#pagination');

  container.innerHTML = `
    <ul class="flex mx-auto list-reset">
      ${!isFirstPage
      ? `
            <li>
              <a
                class="block px-3 py-2 text-white hover:underline"
                href="${createURL(0)}"
                data-value="${0}"
              >
                First
              </a>
            </li>
            <li>
              <a
                class="block px-3 py-2 text-white hover:underline"
                href="${createURL(currentRefinement - 1)}"
                data-value="${currentRefinement - 1}"
              >
                Previous
              </a>
            </li>
            `
      : ''
    }
      ${pages
      .map(
        page => `
            <li>
              <a
                class="block px-3 py-2 text-white hover:underline ${currentRefinement === page ? 'underline text-purple-500' : ''}"
                href="${createURL(page)}"
                data-value="${page}"
              >
                ${page + 1}
              </a>
            </li>
          `
      )
      .join('')}
        ${!isLastPage
      ? `
              <li>
                <a
                  class="block px-3 py-2 text-white hover:underline"
                  href="${createURL(currentRefinement + 1)}"
                  data-value="${currentRefinement + 1}"
                >
                  Next
                </a>
              </li>
              <li>
                <a
                  class="block px-3 py-2 text-white hover:underline"
                  href="${createURL(nbPages - 1)}"
                  data-value="${nbPages - 1}"
                >
                  Last
                </a>
              </li>
              `
      : ''
    }
    </ul>
  `;

  [...container.querySelectorAll('a')].forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      refine(event.currentTarget.dataset.value);
    });
  });
};

// Create the custom widget
const customPagination = instantsearch.connectors.connectPagination(
  renderPagination
);

search.addWidgets([
  customSearchBox({
    container: document.querySelector('#searchbox'),
  }),

  customHits({
    container: document.querySelector('#hits'),
  }),

  customPagination({
    container: document.querySelector('#pagination'),
  }),

  instantsearch.widgets.configure({
    hitsPerPage: 12
  }),
  // instantsearch.widgets.hits({
  //     container: '#hits',
  //     templates: {
  //         item(hit) {
  //             return `
  //                 <div class="flex-1">
  //                     ${instantsearch.highlight({ attribute: 'title', hit })}
  //                 </div>
  //             `;
  //         },
  //     },
  // }),

  // instantsearch.widgets.currentRefinements({
  //     container: '#current-refinements',
  // }),

  // instantsearch.widgets.clearRefinements({
  //     container: '#clear-refinements',
  // }),

  // instantsearch.widgets.refinementList({
  //     container: '#names-list',
  //     attribute: 'subject_name',
  //     templates: {
  //         item(item) {
  //             const { url, label, count, isRefined } = item;

  //             return `
  //         <a href="${url}" style="${isRefined ? 'font-weight: bold' : ''}">
  //             ${label} (${count})
  //         </a>
  //     `;
  //         },
  //     },
  // }),

]);

search.start();