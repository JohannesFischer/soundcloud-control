import { commands } from './lib.js'

function getPlayControls() {
  return document.querySelector('.playControls')
}

function getSoundBadge() {
  return document.querySelector('.playControls__soundBadge')
}

browser.runtime.onMessage.addListener(({ from, subject, goTo }, sender, response) => {
  const { activateTab, nextSong, previousSong, toggleLike, togglePlayback } = commands
  const playControls = getPlayControls()
  const soundBadge = getSoundBadge()

  if (!['command', 'popup'].includes(from) || !playControls || !soundBadge) return

  switch (subject) {
    case togglePlayback: {
      playControls.querySelector('.playControls__play').click()
      break
    }
    case previousSong: {
      playControls.querySelector('.playControls__prev').click()
      break
    }
    case nextSong: {
      playControls.querySelector('.playControls__next').click()
      break
    }
    case toggleLike: {
      soundBadge.querySelector('.sc-button-like').click()
      break
    }
    case activateTab: {
      if (goTo === 'artist') {
        soundBadge.querySelector('.playbackSoundBadge__titleContextContainer a').click()
      }

      if (goTo === 'title') {
        soundBadge.querySelector('.playbackSoundBadge__titleLink').click()
      }

      break
    }
  }

  if (from === 'popup') response(getState())
})

function getState() {
  const playControls = getPlayControls()
  const soundBadge = getSoundBadge()

  if (!playControls || !soundBadge) return false

  const artist = soundBadge.querySelector('.playbackSoundBadge__titleContextContainer a').title
  const songTitle = soundBadge.querySelector('.playbackSoundBadge__titleLink').title
  const imageUrl = soundBadge.querySelector('.image span').style.backgroundImage.match(/url\("(.*)"\)/)[1]
  const likeState = soundBadge.querySelector('.sc-button-like').classList.contains('sc-button-selected')
  const playing = playControls.querySelector('.playControls__play').classList.contains('playing')

  return {
    artist,
    imageUrl,
    likeState,
    playing,
    songTitle
  }
}
