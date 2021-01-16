const searchClient = algoliasearch('08KMSERF1B', '96b7ec122afe6711386467472aaf7a44');

const search = instantsearch({
    indexName: 'Project',
    routing: true,
    searchClient,
});

const renderHits = (renderOptions, isFirstRender) => {
    const {
        hits,
        widgetParams
    } = renderOptions;

    // Handle empty results
    widgetParams.container.innerHTML =
        hits.length < 1
            ? `<div class="col-span-2 lg:col-span-4"><p class="text-lg lg:text-2xl text-gray-200 text-center font-semibold font-heading">Sorry, no results found!</p></div>`
            : `
                ${hits
                .map(
                    item =>
                        `
                            <a class="bg-white bg-opacity-10 shadow-xl rounded-md p-4 transition duration-100 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-opacity-20" href="${item.url}" target="_blank">
                                <h3 class="text-lg lg:text-2xl text-gray-200 text-left font-semibold font-heading hover:text-gray-300">
                                    ${instantsearch.highlight({ attribute: 'title', hit: item })}
                                </h3>
                                <div class="mt-2 text-purple-400 font-bold text-left break-words">
                                    ${instantsearch.highlight({ attribute: 'technologies', hit: item })}
                                </div>
                            </a>
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
        input.classList.add(
            'rounded-md',
            'shadow-lg',
            'w-full',
            'py-3',
            'px-5',
            'text-gray-400',
            'bg-gray-700',
            'placeholder-white',
            'placeholder-opacity-40',
            'focus:outline-none',
            'focus:ring-4',
            'focus:ring-gray-400',
            'focus:ring-opacity-70'
        );
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
    <ul class="flex flex-wrap mx-auto list-reset">
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

// Create the render function
const renderMenuSelect = (renderOptions, isFirstRender) => {
    const { items, canRefine, refine, widgetParams } = renderOptions;

    if (isFirstRender) {
        const select = document.createElement('select');
        select.classList.add('rounded-md',
            'shadow-lg',
            'cursor-pointer',
            'w-full',
            'py-3',
            'px-5',
            'text-purple-500',
            'text-center',
            'bg-white',
            'hover:text-purple-600',
            'focus:outline-none',
            'focus:ring-4',
            'focus:ring-purple-500',
            'focus:ring-opacity-70'
        );

        select.addEventListener('change', event => {
            refine(event.target.value);
        });

        widgetParams.container.appendChild(select);
    }

    const select = widgetParams.container.querySelector('select');

    select.disabled = !canRefine;
    select.innerHTML = `
      <option value="">All languages</option>
      ${items
            .map(
                item =>
                    `<option
              value="${item.value}"
              ${item.isRefined ? 'selected' : ''}
            >
              ${item.label} (${item.count})
            </option>`
            )
            .join('')}
    `;
};

// Create the custom widget
const customMenuSelect = instantsearch.connectors.connectMenu(renderMenuSelect);


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

    customMenuSelect({
        container: document.querySelector('#menu-select'),
        attribute: 'main_language',
        limit: 25,
    }),

    instantsearch.widgets.configure({
        hitsPerPage: 12
    }),

]);

search.start();