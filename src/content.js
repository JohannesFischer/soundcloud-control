const playControls = getPlayControls();

browser.runtime.onMessage.addListener(function (msg, sender, response) {
  const { from, subject } = msg;

  // console.log(from, subject);

  if (!['command', 'popup'].includes(from)) return;

  if (subject === 'toggle-playback') {
    const playBtn = playControls.querySelector('.playControls__play');
    playBtn.click();
    // response(getState());
  }

  if (subject === 'previous-song') {
    const prevBtn = playControls.querySelector('.playControls__prev');
    prevBtn.click();
    // response(getState());
  }

  if (subject === 'next-song') {
    const nextBtn = playControls.querySelector('.playControls__next');
    nextBtn.click();
    // response(getState());
  }

  if (subject === 'toggle-like') {
    const soundBadge = getSoundBadge();
    const likeBtn = soundBadge.querySelector('.sc-button-like');
    likeBtn.click();
    // response(getState());
  }

  if (from === 'popup') {
    response(getState());
  }
});

function getPlayControls() {
  return document.querySelector('.playControls');
}

function getSoundBadge() {
  return document.querySelector('.playControls__soundBadge');
}

function getState() {
  const soundBadge = getSoundBadge();

  const artistLink = soundBadge.querySelector('.playbackSoundBadge__titleContextContainer a');
  const artist = artistLink.title;
  const artistUrl = artistLink.href;

  const titleLink = soundBadge.querySelector('.playbackSoundBadge__titleLink');
  const songTitle = titleLink.title;

  const image = soundBadge.querySelector('.image span');
  const imageUrl = image.style.backgroundImage.match(/url\(\"(.*)\"\)/)[1];

  const likeButton = soundBadge.querySelector('.sc-button-like');
  const likeState = likeButton.classList.contains('sc-button-selected');

  const playing = playControls.querySelector('.playControls__play').classList.contains('playing');

  return {
    artist,
    artistUrl,
    imageUrl,
    likeState,
    playing,
    songTitle
  }
}
