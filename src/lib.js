const soundCloudUrl = 'https://soundcloud.com/*';
const commands = {
  nextSong: 'next-song',
  previousSong: 'previous-song',
  songInfo: 'song-info',
  toggleLike: 'toggle-like',
  togglePlayback: 'toggle-playback'
};

async function executeCommand(message, callback = null) {
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) {
    openSoundCloud();

    if (message.from == 'popup') {
      window.close();
    }

    return;
  }

  browser.tabs.sendMessage(scTabs[0].id, message, callback);
}

async function openSoundCloud() {
  await browser.tabs.create({
    url: soundCloudUrl.replace('*', '')
  });
}

export { commands, executeCommand, soundCloudUrl };
