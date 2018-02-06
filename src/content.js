import { commands } from 'src/lib'

browser.runtime.onMessage.addListener(function(msg, sender, response) {
  const { from, subject, goTo } = msg

  if (!['command', 'popup'].includes(from)) return

  const playControls = getPlayControls()
  const soundBadge = getSoundBadge()

  if (subject === commands.togglePlayback) {
    playControls.querySelector('.playControls__play').click()
  }

  if (subject === commands.previousSong) {
    playControls.querySelector('.playControls__prev').click()
  }

  if (subject === commands.nextSong) {
    playControls.querySelector('.playControls__next').click()
  }

  if (subject === commands.toggleLike) {
    soundBadge.querySelector('.sc-button-like').click()
  }

  if (subject === commands.activateTab) {
    const soundBadge = getSoundBadge()

    if (goTo === 'artist') {
      soundBadge.querySelector('.playbackSoundBadge__titleContextContainer a').click()
    }

    if (goTo === 'title') {
      soundBadge.querySelector('.playbackSoundBadge__titleLink').click()
    }
  }

  if (from === 'popup') {
    response(getState())
  }
})

function getPlayControls() {
  return document.querySelector('.playControls')
}

function getSoundBadge() {
  return document.querySelector('.playControls__soundBadge')
}

function getState() {
  const playControls = getPlayControls()
  const soundBadge = getSoundBadge()

  const artist = soundBadge.querySelector('.playbackSoundBadge__titleContextContainer a').title

  const songTitle = soundBadge.querySelector('.playbackSoundBadge__titleLink').title

  const image = soundBadge.querySelector('.image span')
  const imageUrl = image.style.backgroundImage.match(/url\("(.*)"\)/)[1]

  const likeButton = soundBadge.querySelector('.sc-button-like')
  const likeState = likeButton.classList.contains('sc-button-selected')

  const playing = playControls.querySelector('.playControls__play').classList.contains('playing')

  return {
    artist,
    imageUrl,
    likeState,
    playing,
    songTitle
  }
}
