let storeLink = "";
let vidId = "";
let newYtLink = "";

let covArt = document.querySelector("#albumArt");
let songN = document.querySelector("#songName");
let artistN = document.querySelector("#artistName");
let lyricN = document.querySelector("#lyricArea");
let ebArea = document.querySelector("#ebPlay");
let playPause = document.querySelector("#playbutton");
let vid = document.getElementById("music-video");
let playButton = document.querySelector("#playB");

// pulling from local storage
const mySong = window.localStorage.getItem("songTitle");
let st = JSON.parse(mySong);
const myArtist = window.localStorage.getItem("artistName");
let artistT = JSON.parse(myArtist);
const myCover = window.localStorage.getItem("coverArt");
let coverT = JSON.parse(myCover);

let searchKey = st + " " + artistT;

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'c6a644ac67mshf2a9ee8378a98fdp1048d3jsn58314285c447',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
  }
};

// //------------------------------------------------

// getting lyrics
async function getLyrics() {
  const myLyr = window.localStorage.getItem("lyrPath");
  let path = JSON.parse(myLyr);

  // fetch song lyrics from API
  lyricN.innerHTML = "Loading...";
  let r = await fetch(path, options);
  const lyrJson = await r.json();
  let lyrics = lyrJson.lyrics.lyrics.body.html;
  console.log(lyrJson);
  console.log(lyrics);
  lyricN.innerHTML = lyrics;
}
getLyrics();

//getting song informations
function getInfo() {
  songN.innerHTML = st;
  artistN.innerHTML = artistT;
  covArt.setAttribute("src", coverT);
}
getInfo();

// //------------------------------------------------------------------------------------------------------------------
// //-----------------------------------------------------Video Stuff--------------------------------------------------
// //------------------------------------------------------------------------------------------------------------------
//getting youtube video
async function ytResult() {
  const opts = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '37749dd7e3msh939061c0790b14ap12fd49jsnf4e036dcb678',
      'X-RapidAPI-Host': 'ytube-videos.p.rapidapi.com'
    }
  };
  try{
    let result = await fetch(`https://ytube-videos.p.rapidapi.com/search-video?q=${searchKey}`, opts);
    const ytJson = await result.json();
    const ytLink = await ytJson[0].link;
    vidId = ytJson[0].id
    newYtLink = ytLink.replace('watch?v=', "embed/");
  } catch (error){
    console.error(error);
  }
  
}
ytResult();

function playB() {
  // Add autoplay to video
  newYtLink = newYtLink.concat("?&autoplay=1");
  vid.setAttribute('src', newYtLink);
  storeLink = newYtLink;
};

// // //------------------------------------------------------------------------------------------------------------------
// // //-------------------------------------------- (: PLAYLIST STUFF :) ------------------------------------------------
// // //------------------------------------------------------------------------------------------------------------------
let personalPlayList = loadMyPlayList();


// Get a random ID for search history.
function getRandomId() {
  return Math.floor(Math.random() * 1e6).toString();
}

//create a new playlist item
function createPlaylistItem(t, n, a, v) {
  let likedSong = {
    id: getRandomId(),
    titleOfSong: t,
    nameOfArtist: n,
    albumOfSong: a,
    videoOfSong: v,
  };
  return likedSong;
}

//store liked song in local memory
function saveSong() {
  let likedSongs = JSON.stringify(personalPlayList);
  window.localStorage.setItem('myLikedList', likedSongs);
}

//load the playlist each time
function loadMyPlayList() {
  const s = window.localStorage.getItem('myLikedList');
  console.log(s);
  if (s == null) {
    return [];
  } else {
    return JSON.parse(s);
  }
}

// add to playlist functions
function addToPlayList() {
  let fYtLink = newYtLink;
  if (newYtLink.includes("?&autoplay=1")) {
    fYtLink = newYtLink.replace("?&autoplay=1", "");
  }
  let item = createPlaylistItem(st, artistT, coverT, fYtLink);
  if (notInPlayList()) {
    personalPlayList.splice(0, 0, item);
  } else {
    alert("This song has already been added to your playlist :)");
  }
  saveSong();
  console.log(window.localStorage.getItem('myLikedList'));
}

//return true if does not exist
function notInPlayList() {
  for (let i = 0; i < personalPlayList.length; i++) {
    if (personalPlayList[i].titleOfSong === st && personalPlayList[i].nameOfArtist === artistT && personalPlayList[i].albumOfSong === coverT) {
      return false;
    }
  } return true;
}
