"use strict";
// debugger
/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favoritedStories.hide();
  $submitForm.hide();
  $ownStories.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// A function that is called when users click the navbar button 'submit'.
const $submitForm = $('#submit-form')
$submitForm.hide() 

// function navShowSubmitFormClick(evt) {
//   console.debug("navShowSubmitFormClick", evt);
  $("#nav-submit-story").on('click', function(){
    $submitForm.show()
  })
// }

/** Show favorite stories with click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  // evt.stopPropagation();
  hidePageComponents();
  $ownStories.hide()
  putFavoritesListOnPage();
}

$("#nav-favorites").on("click", navFavoritesClick);

// Show own stories with click on "my story"

function navMyStoriesClick() {
  hidePageComponents();
  putOwnStoriesOnPage()
  $favoritedStories.hide()
  $ownStories.show()
}

$("#nav-my-stories").on("click", navMyStoriesClick);
