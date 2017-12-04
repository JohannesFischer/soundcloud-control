const imageSize = 250;
const soundCloudUrl = 'https://soundcloud.com/*';

async function openSoundCloud() {
  await browser.tabs.create({
    url: soundCloudUrl.replace('*', '')
  });
}

function updatePopup(state) {
  const { artist, imageUrl, likeState, playing, songTitle } = state;

  const coverArtEl = document.querySelector('.image .cover-art');
  const imageSrc = imageUrl.replace(/(\d+x\d+)\.jpg/, `${imageSize}x${imageSize}.jpg`);
  coverArtEl.classList.remove('loaded');

  loadCoverArt(imageSrc).then(() => {
    coverArtEl.classList.add('loaded');
    coverArtEl.style.backgroundImage = `url(${imageSrc})`;
  });

  document.querySelector('.artist').innerText = artist;
  const songTitleEl = document.querySelector('.song-title');
  songTitleEl.innerText = songTitle;
  songTitleEl.title = songTitle;

  const playControl = document.querySelector('.control-playback-toggle');

  if (playing) {
    playControl.classList.add('playing');
  } else {
    playControl.classList.remove('playing');
  }

  const likeBtn = document.querySelector('.control-like');
  likeBtn.title = likeState ? 'Unlike' : 'Like';

  if (likeState === true) {
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

async function executeCommand(subject, callback) {
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) {
    openSoundCloud();
    window.close();
    return;
  }

  const payLoad = Object.assign({ from: 'popup' }, subject);

  browser.tabs.sendMessage(scTabs[0].id, payLoad, callback);
}

// Event Listeners

window.addEventListener('DOMContentLoaded', () => {
  executeCommand({ subject: 'song-info' }, updatePopup);
});

document.querySelector('.control-playback-toggle').addEventListener('click', () => {
  executeCommand({ subject: 'toggle-playback' }, updatePopup);
});

document.querySelector('.control-previous').addEventListener('click', () => {
  executeCommand({ subject: 'previous-song' }, updatePopup);
});

document.querySelector('.control-next').addEventListener('click', () => {
  executeCommand({ subject: 'next-song' }, updatePopup);
});

document.querySelector('.control-like').addEventListener('click', () => {
  executeCommand({ subject: 'toggle-like' }, updatePopup);
});
