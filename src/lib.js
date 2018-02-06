const soundCloudUrl = 'https://soundcloud.com/*'
const commands = {
  activateTab: 'activate-tab',
  nextSong: 'next-song',
  previousSong: 'previous-song',
  songInfo: 'song-info',
  toggleLike: 'toggle-like',
  togglePlayback: 'toggle-playback'
}

async function executeCommand(message, callback = null) {
  const scTabs = await browser.tabs.query({
    url: soundCloudUrl
  })

  if (scTabs.length === 0) {
    openSoundCloud()

    if (message.from === 'popup') {
      window.close()
    }

    return
  }

  const targetTab = scTabs.length > 1
    ? scTabs.find(tab => tab.audible) || scTabs[0]
    : scTabs[0]

  if (message.subject === commands.activateTab) {
    await browser.tabs.update(
      targetTab.id, {
        active: true
      }
    )
    window.close()
  }

  browser.tabs.sendMessage(targetTab.id, message, callback)
}

async function openSoundCloud() {
  await browser.tabs.create({
    url: soundCloudUrl.replace('*', '')
  })
}

export { commands, executeCommand }
