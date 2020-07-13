"use strict"

let pfrApiUrl = function pfrApiUrll(path) {
  return pfrApiUrll.local 
  ? 'http://localhost:8006' + path
  : 'http://iris.uat.pfr.co.nz:8800'
}
pfrApiUrl.local = false

const pfr_api_token = "Token 770b67a2bf91b0e8af784112da2e277661f2772c"


// hook localhost test checkbox to handler
const toggleLocal = document.getElementById('uselocalhost')
toggleLocal.addEventListener('change', (event) => {
  pfrApiUrl.local = event.target.checked
  console.log('local', pfrApiUrl.local, pfrApiUrl())
});

// login box
const loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener('click', handleLogin);
const loginrequest = new XMLHttpRequest();

function handleLogin(e) {
  const usernameInput = document.getElementById('username')
  const passwordInput = document.getElementById('password')

  const username = usernameInput.value
  const password = passwordInput.value
  console.log('login', username, password )

  const query = pfrApiUrl('/api/api-token-auth')
  loginrequest.open('POST', query, true);
  loginrequest.send(`username=${username}&password=${password}`);
}
// Setup our listener to process completed requests
loginrequest.onload = () => {
	if (loginrequest.status >= 200 && loginrequest.status < 300) {
		// This will run when the request is successful
    const json = JSON.parse(personrequest.response)
    
    console.log('success!', json);
	} else {
		// This will run when it's not
	}
};

// find page elements for name search
const nameSearch = document.getElementById('nameSearch')
nameSearch.addEventListener('input', handlePersonSearch);
const personResults = document.getElementById('personResults');
const personrequest = new XMLHttpRequest();

function processNames(res) {
  if (res.count > 0 ) {
    for (let item of res.results) {
      const name = `${item.given_name} ${item.other_given_names?`${item.other_given_names} `:''}${item.family_name}` 
      appendLi(personResults, name)
    }
  } else {
    appendP(personResults, 'no results')
  }
}

function handlePersonSearch(e) {
  resetResponse(personResults)
  
  const query = pfrApiUrl('/api/people?family_name__icontains=') + e.target.value
  personrequest.open('GET', query);
  personrequest.setRequestHeader('Authorization', pfr_api_token)
  personrequest.send();
}
// Setup our listener to process completed requests
personrequest.onload = () => {
	if (personrequest.status >= 200 && personrequest.status < 300) {
		// This will run when the request is successful
    const json = JSON.parse(personrequest.response)
    processNames(json)
    // console.log('success!', json);
	} else {
		// This will run when it's not
		appendResponse(personResults, 'The request failed!');
	}
};


// Project search
const projectSearch = document.getElementById('projectSearch')
projectSearch.addEventListener('input', handleProjectSearch);
const projectResults = document.getElementById('projectResults');
const projectrequest = new XMLHttpRequest();

function handleProjectSearch(e) {
  resetResponse(projectResults)
  
  const query = pfrApiUrl('/api/projects/?search=') + e.target.value
  projectrequest.open('GET', query);
  projectrequest.setRequestHeader('Authorization', pfr_api_token)
  projectrequest.send();
}

// Setup our listener to process completed requests
projectrequest.onload = () => {
	if (projectrequest.status >= 200 && projectrequest.status < 300) {
		// This will run when the request is successful
    const json = JSON.parse(projectrequest.response)
    processProjects(json)
    // console.log('success!', json);
	} else {
		// This will run when it's not
		appendResponse(projectResults, 'The request failed!');
	}
};

function processProjects(res) {
  if (res.count > 0 ) {
    // console.log(res)
    for (let item of res.results) {
      const name = `${item.local_project_identifier} ${item.project_title}` 
      appendLi(projectResults, name)
    }
  } else {
    appendP(projectResults, 'no results')
  }
}
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