import { commands, executeCommand } from 'src/lib'

function updatePopup(state) {
  if (!state) return window.close()

  const imageSize = 500
  const { artist, imageUrl, likeState, playing, songTitle } = state

  const coverArtEl = document.querySelector('.image .cover-art')
  const imageSrc = imageUrl.replace(/(\d+x\d+)\.jpg/, `${imageSize}x${imageSize}.jpg`)
  coverArtEl.classList.remove('loaded')

  loadCoverArt(imageSrc).then(() => {
    coverArtEl.classList.add('loaded')
    coverArtEl.style.backgroundImage = `url(${imageSrc})`
  })

  document.querySelector('.artist p').textContent = artist
  const songTitleEl = document.querySelector('.song-title p')
  songTitleEl.textContent = songTitle
  songTitleEl.title = songTitle

  const playControl = document.querySelector('.control-playback-toggle')
  playControl.classList[playing ? 'add' : 'remove']('playing')

  const likeBtn = document.querySelector('.control-like')
  likeBtn.title = likeState ? 'Unlike' : 'Like'
  likeBtn.classList[likeState ? 'add' : 'remove']('liked')
}

function loadCoverArt(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
}

// Event Listeners

window.addEventListener('DOMContentLoaded', () => {
  executeCommand({ from: 'popup', subject: commands.songInfo }, updatePopup)
})

document.querySelector('.control-playback-toggle').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: commands.togglePlayback }, updatePopup)
})

document.querySelector('.control-previous').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: commands.previousSong }, updatePopup)
})

document.querySelector('.control-next').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: commands.nextSong }, updatePopup)
})

document.querySelector('.control-like').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: commands.toggleLike }, updatePopup)
})

document.querySelector('.song-info .artist').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: commands.activateTab, goTo: 'artist' })
})

document.querySelector('.song-info .song-title').addEventListener('click', () => {
  executeCommand({ from: 'popup', subject: commands.activateTab, goTo: 'title' })
})
