const imageSize = 250;
const soundCloudUrl = 'https://soundcloud.com/*';

function updateSongInfo(songInfo) {
  console.log('received from content script: ', songInfo);

  const image = document.querySelector('img');
  image.width= imageSize;
  image.src = songInfo.imageUrl.replace(/(\d+x\d+)/, `${imageSize}x${imageSize}`);

  document.querySelector('#artist').innerText = songInfo.artist;
  document.querySelector('#title').innerText = songInfo.title;

  const likeBtn = document.querySelector('p.like');

  if (songInfo.likeState === true) {
    likeBtn.classList.add('liked');
  } else {
    likeBtn.classList.remove('liked');
  }
}

function playerState(state) {
  console.log('received from content script: ', state);
}

async function executeCommand(msg, callback) {
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) {
    openSoundCloud();
    return;
  }

  browser.tabs.sendMessage(scTabs[0].id, msg, callback);
}

window.addEventListener('DOMContentLoaded', function () {
  executeCommand({ from: 'popup', subject: 'DOMInfo' }, updateSongInfo);
});

document.querySelector('#play').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'toggle-playback' }, playerState);
});

document.querySelector('#previous').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'previous-song' }, updateSongInfo);
});

document.querySelector('#next').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'next-song' }, updateSongInfo);
});

document.querySelector('.like').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: 'toggle-like' }, updateSongInfo);
});
