import { commands } from 'src/lib'

function getPlayControls() {
  return document.querySelector('.playControls')
}

function getSoundBadge() {
  return document.querySelector('.playControls__soundBadge')
}

browser.runtime.onMessage.addListener((msg, sender, response) => {
  const { from, subject, goTo } = msg

  if (!['command', 'popup'].includes(from)) return

  const playControls = getPlayControls()
  const soundBadge = getSoundBadge()

  switch (subject) {
    case commands.togglePlayback: {
      playControls.querySelector('.playControls__play').click()
      break
    }
    case commands.previousSong: {
      playControls.querySelector('.playControls__prev').click()
      break
    }
    case commands.nextSong: {
      playControls.querySelector('.playControls__next').click()
      break
    }
    case commands.toggleLike: {
      soundBadge.querySelector('.sc-button-like').click()
      break
    }
    case commands.activateTab: {
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
