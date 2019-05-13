//Your code here
const submitButton = document.getElementById('btn-submit');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const descriptionInput = document.getElementById('description-input');
const locationInput = document.getElementById('location-input');

submitButton.addEventListener('click', e => {
  e.preventDefault();

  // Remove previous search results if present
  clearJobList();
  clearJobDescription();

  // Display the new search results based on the input values
  const description = descriptionInput.value;
  const location = locationInput.value;
  displaySearchResults(description, location);
});

function clearJobList() {
  if (sidebar.firstChild) {
    sidebar.firstChild.remove();
  }
}

function clearJobDescription() {
  if (mainContent.firstChild) {
    mainContent.firstChild.remove();
  }
}

async function displaySearchResults(description, location) {
  const getSearchResults = await fetch(
    `http://github-jobs-api-proxy.herokuapp.com/jobs?description=${description}&location=${location}`
  );
  const jobsData = await getSearchResults.json();
  createJobsList(jobsData);
}
//BONUS: Try Catch -- error handling! (what if we don't enter the URL correctly)

function createJobsList(jobs) {
  // Create a div for the list of jobs returned from the user's search
  const containerDiv = document.createElement('div');
  sidebar.appendChild(containerDiv);

  // Create the header for the outer div
  const sidebarHeader = document.createElement('h2');
  const headerText = document.createTextNode(`Found ${jobs.length} Gigs`);
  sidebarHeader.appendChild(headerText);
  containerDiv.appendChild(sidebarHeader);

  // Create a small posting for each job and append it to the outer div
  for (let i = 0; i < jobs.length; i++) {
    const jobPosting = createJobPosting(jobs[i], containerDiv);
    containerDiv.appendChild(jobPosting)
    //NOTE: h3, span, and button in a div
  }
}

function createJobPosting(job) {
  // NOTE: start with old syntax, add note about destructuring
  const company = job.company;
  const location = job.location;
  const title = job.title

  // const { company, location, title } = job;

  // Each job posting should have a header with the name of the company and location
  const jobPosting = document.createElement('div');

  const jobHeader = document.createElement('h3');
  const jobHeaderText = document.createTextNode(`${company}, ${location}`);
  jobHeader.appendChild(jobHeaderText);
  jobPosting.appendChild(jobHeader);

  // The job title and a 'View' button on the same line below the header
  // const innerDiv = document.createElement('div');
  // innerDiv.setAttribute('id', 'innerDiv');
  // parentNode.appendChild(innerDiv);

  const jobTitle = document.createElement('span');
  const jobTitleText = document.createTextNode(title);
  jobTitle.appendChild(jobTitleText);
  jobPosting.appendChild(jobTitle);

  // The button should display the full job description in the adjacent panel
  const viewButton = document.createElement('button');
  viewButton.setAttribute('id', 'btn-view');
  const viewButtonText = document.createTextNode('View');
  viewButton.appendChild(viewButtonText);
  viewButton.addEventListener('click', e => {
    viewJobDescription(job);
  });
  jobPosting.appendChild(viewButton);

  return jobPosting
}

function viewJobDescription(job) {
  // Clear the description panel if needed
  clearJobDescription();

  // You must sanitize the HTML string from your API call before using it
  const { description } = job;
  var cleanedDescription = DOMPurify.sanitize(description);

  // Create a div for the description that contains a header and the full job description
  const div = document.createElement('div');
  div.setAttribute('id', 'jobs-content');
  div.innerHTML = `<h2>${job.company}, ${job.location}</h2>${cleanedDescription}`;
  mainContent.appendChild(div);
}
