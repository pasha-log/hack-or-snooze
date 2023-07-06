'use strict';
// debugger
// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// <span class="star">
//   <i class="far fa-star"></i>
// </span>

function generateStoryMarkup(story) {
	const hostName = story.getHostName();
	let showTrash = false;
	let showStar = false;
	if (currentUser) {
		showTrash = Boolean(currentUser.ownStories.includes(story));
		showStar = Boolean(currentUser);
	}
	return $(`
      <li id="${story.storyId}">
      ${showTrash ? getDeleteBtnHTML() : ''}
      ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make delete button HTML for story */

function getDeleteBtnHTML() {
	return `
      <span class="trash-can">
        <i class="fas fa-trash-alt">
        </i>
      </span>`;
}

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
	const isFavorite = user.isFavorite(story);
	const starType = isFavorite ? 'fas' : 'far';
	return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		// console.log(story);
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

// Function for when users submit their form.

// function userSubmitsStoryForm() {
$('#submit-story').on('click', async function() {
	let author = $('#create-author').val();
	let title = $('#create-title').val();
	let url = $('#create-url').val();
	await storyList.addStory(currentUser, { title, author, url });
	window.location.reload();
});

// }

/******************************************************************************
 * Functionality for favorites list and starr/un-starr a story
 */

/** Put favorites list on page. */

$favoritedStories.hide();
function putFavoritesListOnPage() {
	$favoritedStories.empty();
	if (currentUser.favorites.length === 0) {
		$favoritedStories.append('<h1>No Favorites Added!</h1>');
	} else {
		for (let story of currentUser.favorites) {
			const $story = generateStoryMarkup(story);
			$favoritedStories.append($story);
		}
	}
	$favoritedStories.show();
  $favoritedStories.on('click', '.star', toggleStoryFavorite);
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
	const $targ = $(evt.target);
	const $closestLi = $targ.closest('li');
	const storyId = $closestLi.attr('id');
	const story = storyList.stories.find((s) => s.storyId === storyId);
	if ($targ.hasClass('fas')) {
		await currentUser.removeFavorite(story);
		$targ.closest('i').removeClass('far');
	} else {
		await currentUser.addFavorite(story);
		$targ.closest('i').addClass('fas');
	}
}

$allStoriesList.on('click', '.star', toggleStoryFavorite);

// Once I have submitted a story, add it to an array list of my submitted stories.
// Append each submitted story to the hidden submitted "#my-story" page the same way as the favorites.
// Only this time, add a little garbage can icon next to it. Create an event listener for the garbage to remove from
// list of submitted stories.

// Add HTML for My Stories page.

$ownStories.hide();
function putOwnStoriesOnPage() {
	$ownStories.empty();
	if (currentUser.ownStories.length === 0) {
		$ownStories.append('<h1>No stories added by user yet!</h1>');
	} else {
		for (let userStory of currentUser.ownStories) {
			const $userStory = generateStoryMarkup(userStory);
			$ownStories.append($userStory);
		}
	}
	$ownStories.show();
}

/** Handle deleting a story. */

async function deleteStory(evt) {
	console.debug('deleteStory');

	const $closestLi = $(evt.target).closest('li');
	const storyId = $closestLi.attr('id');

	await storyList.removeStory(currentUser, storyId);

	// re-generate story list
	await putOwnStoriesOnPage();
}

$ownStories.on('click', '.trash-can', deleteStory);
