console.log("script running");

let queryJson = 0;
let qJson = 0;
let input = document.querySelector("#name-search");
let iButton = document.querySelector("#go-search-name");
let resultBody = document.querySelector(".sec");
let resultSection = document.querySelector("#resultC");
let thePlayList = document.querySelector("#liked-list");
let musicVideo = document.querySelector('#mus-vid')
let songInfo = [];
let baseURl = `https://genius-song-lyrics1.p.rapidapi.com`;
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'c6a644ac67mshf2a9ee8378a98fdp1048d3jsn58314285c447',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
  }
};
//-----------------------------------------------------------------------------------------------------
//------------------------------------SEARCH BAR & RESULT DISPLAY--------------------------------------
//-----------------------------------------------------------------------------------------------------
//search for result
// -- by click search button
iButton.addEventListener("click", async () => {
  clearResult();
  spitResult();
  addSearchHistory();
  resultBody.classList.remove("hidden");
  reset();
  // jump to the result section, id= resultC
  resultSection.scrollIntoView({ behavior: 'smooth' });
})

// -- by click enter
input.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    clearResult();
    spitResult();
    addSearchHistory();
    resultBody.classList.remove("hidden");
    reset();
    // jump to the result section
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }
})

//clear the results
function clearResult() {
  var exist = document.getElementById("result-list");
  exist.innerHTML = "";
}

//api for basic info stuff
async function fetchSong(input, count) {
  
  const url = baseURl + `/search/?q=${input}&per_page=${count}&page=1`;
  try {
    const result = await fetch(url, options);
    const songJson = await result.json();
    return songJson;
  } catch (error) {
    console.error(error);
  }
  
}

//spits out search results
async function spitResult() {

  queryJson = await fetchSong(input.value, 12);

  //adding cards to result by appending :)
  var songCount = 0;
  var arr = queryJson.hits;
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
    //add div
    var newCard = document.createElement('div');
    newCard.classList.add('card');

    //add button
    var playb = document.createElement('div');
    playb.innerHTML = `<button class = "cardBtn" data-target="${songCount}">Get Lyrics!</i>`;

    //add img
    var fig = document.createElement('figure');
    fig.classList.add('image');
    var img = document.createElement('img');
    img.setAttribute('src', arr[i].result.header_image_thumbnail_url);
    fig.append(img);

    //add title
    var title = document.createElement('div');
    title.classList.add("content");
    title.classList.add("songName");
    title.innerText = arr[i].result.title;

    //add author
    var artist = document.createElement('div');
    artist.classList.add("content");
    artist.classList.add("artist");
    artist.innerText = arr[i].result.artist_names;

    //grab the holder for all the cards & append everything to holder
    var holder = document.getElementById('result-list');
    newCard.append(fig);
    newCard.append(title);
    newCard.append(artist);
    newCard.append(playb)
    holder.append(newCard);

    songCount += 1;
  };

  //modify result title
  let ans = document.getElementById('resultC');
  if (songCount > 1) {
    ans.innerHTML = songCount + " results related to \"" + input.value + "\" found";
  } else {
    ans.innerHTML = songCount + " result related to " + input.value + " found";
  };
  input.value = "";
  buttonClick();
};

// //--------------------------------------------------------------------------------------------------
// //-----------------------------Selected card stored in local storage--------------------------------
// //--------------------------------------------------------------------------------------------------

//store info
function buttonClick() {
  let buttons = document.querySelectorAll(".cardBtn");
  buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
      let num = button.dataset.target; // number grabbed
      console.log("num is...." + num)
      var arr = queryJson.hits;
      console.log("test..." + arr)

      // songInfo
      let songID = arr[num].result.id;
      lyrPath = baseURl + `/song/lyrics/?id=${songID}`;
      saveInfo("lyrPath", lyrPath);
      saveInfo("songTitle", arr[num].result.title);
      saveInfo("artistName", arr[num].result.artist_names);
      saveInfo("coverArt", arr[num].result.header_image_thumbnail_url);
      
      window.location.href = "lyrics.html";
    })
  });
};

//create storage place
function saveInfo(name, input) {
  let info = JSON.stringify(input);
  window.localStorage.setItem(name, info);
}


// //------------------------------------------------------------------------------------------------------------------
// //--------------------------------------Song Timeline Exploration Section-------------------------------------------
// //------------------------------------------------------------------------------------------------------------------
let musicT = document.querySelectorAll(".song-history-list");
let keywords = ["White Christmas Bing Crosby", "We're Gonna Rock Around the Clock", "Hey Jude", "Bohemian Rhapsody", "Billie Jean Michael Jackson", "I Believe I Can Fly R. Kelly", "We Belong Together"];
let playListInfo = [];

loadImg();

async function loadImg() {
  for (let w = 0; w < musicT.length; w++) {
    let store = await fetchSong(keywords[w], 1);
    let thisSong = store.hits[0];
    musicT[w].children[1].children[0].children[0].setAttribute("src", thisSong.result.header_image_thumbnail_url);
    let press = document.createElement('div');
    press.innerHTML = `<button class ="cardBtn" onclick="listenForHistoryPlay(${w})">Play</button>`;
    musicT[w].children[1].children[1].append(press);

    playListInfo.push(thisSong.result.title + " " + thisSong.result.artist_names);
  }
}

//getting youtube video, returns the link
async function videoLoad(counter) {
  const vidUrl = `https://youtube138.p.rapidapi.com/search/?q=${playListInfo[counter]}=en&gl=US`;
  const opts = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c6a644ac67mshf2a9ee8378a98fdp1048d3jsn58314285c447',
      'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
    }
  };

  try {
    let result = await fetch(vidUrl, opts);
    const ytJson = await result.json();
    const arr = ytJson.contents;
    vidId = arr[0].video.videoId;
    finytLink = `https://www.youtube.com/embed/${vidId}`;
    return finytLink
  } catch (error) {
    console.error(error);
  }
  
}

//play music
async function listenForHistoryPlay(m) {
  let playLink = await videoLoad(m);
  finLink = playLink + "?start=80&autoplay=1";
  console.log(finLink);
  musicVideo.innerHTML = `<iframe class="hidden" src =${finLink} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;

  //also brighten the image of the playing song
  for (let y = 0; y < musicT.length; y++) {
    musicT[y].children[1].children[0].children[0].style.filter = "grayscale(70%)";
  } musicT[m].children[1].children[0].children[0].style.filter = "grayscale(0%)";
}


// //------------------------------------------------------------------------------------------------------------------
// //------------------------------------------- Displaying Playlist :) -----------------------------------------------
// //------------------------------------------------------------------------------------------------------------------
let mPlayList = loadThePlayList();
displayLikedSongs();

//load the playlist each time
function loadThePlayList() {
  const s = window.localStorage.getItem('myLikedList');
  console.log(s);
  if (s == null) {
    return [];
  } else {
    return JSON.parse(s);
  }
}

function listenForPlay(h) {
  playLink = mPlayList[h].videoOfSong.concat("?&autoplay=1");
  musicVideo.innerHTML = `<iframe class="hidden" src =${playLink} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
}

function displayLikedSongs() {
  for (let p = 0; p < mPlayList.length; p++) {
    let songDiv = document.createElement('div');
    songDiv.classList.add("my-fav-song");
    songDiv.setAttribute('id', `${mPlayList[p].id}`);
    songDiv.innerHTML = ` 
    <div class ="favcard">
      <figure>
        <img src="${mPlayList[p].albumOfSong}"></img>
      </figure>
      <div class="txtbox">
        <p class="txt txttitle">${mPlayList[p].titleOfSong}</p>
        <p class="txt txtname">${mPlayList[p].nameOfArtist}</p>
        <button class="cardBtn" onclick = "listenForPlay(${p})">Play</button>
      </div>
    </div>`;
    thePlayList.append(songDiv);
  }
}


