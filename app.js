"use strict"
// const pfr_api_url = 'http://iris.uat.pfr.co.nz:8800/api/people?family_name__icontains='
const pfr_api_url = 'http://localhost:8006/api/people?family_name__icontains='
const pfr_api_token = "Token 6c4cc8dca733ee76869d5096ad0dfeae5231eb2c"

// find page elements
const nameSearch = document.getElementById('nameSearch')
const personResults = document.getElementById('personResults');
// Set up our HTTP request
const xhr = new XMLHttpRequest();

// hook input field to handler
nameSearch.addEventListener('input', updateValue);

function processNames(res) {
  if (res.count > 0 ) {
    const names = res.results.map( item => {
      return `${item.given_name} ${item.other_given_names?`${item.other_given_names} `:''}${item.family_name}` 
    })
    for (let n of names) {
      appendLi(personResults, n)
    }
  } else {
    appendP(personResults, 'no results')
  }
}

function updateValue(e) {
  // results.textContent = e.target.value;
  // appendResponse(results, e.target.value)
  // Create and send a GET request
  // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
  // The second argument is the endpoint URL
  resetResponse(personResults)
  const query = pfr_api_url + e.target.value
  xhr.open('GET', query);
  xhr.setRequestHeader('Authorization', pfr_api_token)
  xhr.send();
}
// Setup our listener to process completed requests
xhr.onload = () => {
	if (xhr.status >= 200 && xhr.status < 300) {
		// This will run when the request is successful
    const json = JSON.parse(xhr.response)
    processNames(json)
    // console.log('success!', json);
	} else {
		// This will run when it's not
		appendResponse(personResults, 'The request failed!');
	}
};

function resetResponse(target) {
  target.innerHTML = ''
}
function appendP(target, text) {
  const p = document.createElement('p');
  p.innerHTML = text;
  target.insertBefore( p, null );
}

function appendLi(target, text) {
  const p = document.createElement('li');
  p.innerHTML = text;
  target.insertBefore( p, null );
}