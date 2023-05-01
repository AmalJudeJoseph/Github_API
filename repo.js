const apiBaseUrl = "https://api.github.com";
const perPage = 10; 

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultsContainer = document.querySelector("#results-container");
const paginationContainer = document.querySelector("#pagination-container");
const errorMessage = document.querySelector("#error-message");

let currentPage = 1;
let totalPages = 0;


function fetchRepositories(query, page) {
  const url = `${apiBaseUrl}/search/repositories?q=${query}&sort=stars&order=desc&page=${page}&per_page=${perPage}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      return response.json();
    })
    .then((data) => {
      totalPages = Math.ceil(data.total_count / perPage);
      return data.items.map((item) => ({
        name: item.name,
        description: item.description,
        stars: item.stargazers_count,
        forks: item.forks_count,
        issues: item.open_issues_count,
        lastUpdated: new Date(item.updated_at).toLocaleDateString(),
        url: item.html_url,
      }));
    });
}


function renderRepositories(repositories) {
  resultsContainer.innerHTML = "";
  repositories.forEach((repository) => {
    const repositoryElement = document.createElement("div");
    repositoryElement.classList.add("repository");

    const nameElement = document.createElement("h2");
    const nameLink = document.createElement("a");
    nameLink.href = repository.url;
    nameLink.textContent = repository.name;
    nameElement.appendChild(nameLink);
    repositoryElement.appendChild(nameElement);

    if (repository.description) {
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = repository.description;
      repositoryElement.appendChild(descriptionElement);
    }

    const statsElement = document.createElement("div");
    statsElement.classList.add("stats");

    const starsElement = document.createElement("span");
    starsElement.classList.add("stars");
    starsElement.textContent = `Stars: ${repository.stars}`;
    statsElement.appendChild(starsElement);

    const forksElement = document.createElement("span");
    forksElement.classList.add("forks");
    forksElement.textContent = `Forks: ${repository.forks}`;
    statsElement.appendChild(forksElement);

    const issuesElement = document.createElement("span");
    issuesElement.classList.add("issues");
    issuesElement.textContent = `Open Issues: ${repository.issues}`;
    statsElement.appendChild(issuesElement);

    const lastUpdatedElement = document.createElement("span");
    lastUpdatedElement.classList.add("last-updated");
    lastUpdatedElement.textContent = `Last Updated: ${repository.lastUpdated}`;
    statsElement.appendChild(lastUpdatedElement);

    repositoryElement.appendChild(statsElement);
    resultsContainer.appendChild(repositoryElement);
  });
}


function renderPagination() {
  paginationContainer.innerHTML = "";
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        fetchAndRenderRepositories(searchInput.value);
      });
      if (i === currentPage) {
        pageButton.classList.add("active");
      }
      paginationContainer.appendChild(pageButton);
    }
  }
}


function fetchAndRenderRepositories(query) {
    fetchRepositories(query, currentPage)
    .then((repositories) => {
    renderRepositories(repositories);
    renderPagination();
    })
    .catch((error) => {
    resultsContainer.innerHTML = "";
    paginationContainer.innerHTML = "";
    errorMessage.textContent = error.message;
    });
    }
    
    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 1;
    fetchAndRenderRepositories(searchInput.value);
    });
    
    function getRepoStats() {
      const owner = document.getElementById('owner').value;
      const repo = document.getElementById('repo').value;
      const url = `https://api.github.com/repos/${owner}/${repo}`;
    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const statsContainer = document.getElementById('stats-container');
          statsContainer.innerHTML = `
            <h2>Stats for ${owner}/${repo}</h2>
            <ul>
              <li>${emojione.toImage(':star:')} Stars: ${data.stargazers_count || 'Not Available'}</li>
              <li>${emojione.toImage(':fork_and_knife:')} Forks: ${data.forks_count || 'Not Available'}</li>
              <li>${emojione.toImage(':eyes:')} Watchers: ${data.subscribers_count || 'Not Available'}</li>
              <li>${emojione.toImage(':warning:')} Open Issues: ${data.open_issues_count || 'Not Available'}</li>
              <li>${emojione.toImage(':chart_with_upwards_trend:')} Code Frequency: ${data.code_frequency ? data.code_frequency.length : 'Not Available'}</li>
              <li>${emojione.toImage(':busts_in_silhouette:')} Contributors: ${data.contributors_url}</li>
              <li>${emojione.toImage(':pencil2:')} Commits: ${data.commits ? data.commits.length : 'Not Available'}</li>
              <li>${emojione.toImage(':arrows_clockwise:')} Pull Requests: ${data.pulls ? data.pulls.length : 'Not Available'}</li>
              <li>${emojione.toImage(':white_check_mark:')} Code Coverage: ${data.topics && data.topics.includes('code-coverage') ? 'Yes' : 'No'}</li>
            </ul>
          `;
        })
        .catch(error => {
          const statsContainer = document.getElementById('stats-container');
          statsContainer.innerHTML = `
            <p>Error: ${error.message}</p>
          `;
        });
    }
    
    
      
      
