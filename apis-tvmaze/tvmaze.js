

altImage = "https://tinyurl.com/tv-missing";
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const shows = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

  console.log(shows);
  let showArray = [];

  for (let result of shows.data) {
    const id = result.show.id;
    const name = result.show.name;
    const summary = result.show.summary;

    if (!result.show.image) {
      showArray.push({ id: id, name: name, summary: summary, image: altImage });
    } else {
      showArray.push({ id: id, name: name, summary: summary, image: result.show.image.original });
    }
  }
  console.log(showArray);
  return showArray;

}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  console.log(shows);
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          
         <div class="card-body">
         <img class="card-img-top" src="${show.image}"> 
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
          <button id="epbtn" class="btn btn-outline-secondary" type="click">Episods</button>
        
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
  //Epsiodes button call
  //test 
  $("body").on("click", function (e) {
    const target = e.target.id;
    if (target === "epbtn") {
      const btnId = e.target.offsetParent.dataset.showId;
      getEpisodes(btnId);
    }
  })
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes


  // TODO: return array-of-episode-info, as described in docstring above
  const showEp = await axios.get(` http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(showEp);
  let EpArray = [];

  for (let result of showEp.data) {
    const id = result.id;
    const name = result.name;
    const summary = result.season;
    const number = result.number;
    const epUrl = result.url;


    EpArray.push({ id: id, name: name, season: summary, number: number, epUrl: epUrl });

  }

  populateEpisodes(EpArray);

}



function populateEpisodes(shows) {
  const $showList = $("#episodes-area");
  const $showsList = $("#episodes-list");
  $showList.show();
  $showsList.empty();
  console.log(shows);
  for (let show of shows) {
    let $item = $(
      `<li> <a href="${show.epUrl}">${show.name}(season :" ${show.season}", number :" ${show.number}"</a>)</li> 
      `);
    $showsList.append($item);
  }
}


