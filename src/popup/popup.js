const imageSize = 250;
const soundCloudUrl = 'https://soundcloud.com/*';

async function openSoundCloud() {
  await browser.tabs.create({
    url: soundCloudUrl.replace('*', '')
  });
}

function updateSongInfo(songInfo) {
  console.log('received from content script: ', songInfo);

  const coverArtEl = document.querySelector('.image .coverArt');
  const imageSrc = songInfo.imageUrl.replace(/(\d+x\d+)/, `${imageSize}x${imageSize}`);
  coverArtEl.classList.remove('loaded');

  loadCoverArt(imageSrc).then(() => {
    console.log('img loaded');
    coverArtEl.classList.add('loaded');
    coverArtEl.style.backgroundImage = `url("${imageSrc}")`;
  });

  document.querySelector('#artist').innerText = songInfo.artist;
  document.querySelector('#title').innerText = songInfo.title;

  const likeBtn = document.querySelector('.control-like');
  console.log(likeBtn);
  if (songInfo.likeState === true) {
    likeBtn.classList.add('liked');
  } else {
    likeBtn.classList.remove('liked');
  }
}

function loadCoverArt(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
}

function playerState(state) {
  const { playing } = state;
  const playControl = document.querySelector('.control-playback-toggle');

  if (playing) {
    playControl.classList.add('playing');
  } else {
    playControl.classList.remove('playing');
  }
}

async function executeCommand(msg, callback) {
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) {
    openSoundCloud();
    window.close();
    return;
  }

  browser.tabs.sendMessage(scTabs[0].id, msg, callback);
}

// Event Listeners

window.addEventListener('DOMContentLoaded', function () {
  executeCommand({ from: 'popup', subject: 'song-info' }, updateSongInfo);
});

document.querySelector('.control-playback-toggle').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'toggle-playback' }, playerState);
});

document.querySelector('.control-previous').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'previous-song' }, updateSongInfo);
});

document.querySelector('.control-next').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'next-song' }, updateSongInfo);
});

document.querySelector('.control-like').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'toggle-like' }, updateSongInfo);
});
