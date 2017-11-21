'use strict'

/* eslint-env browser, webextensions */

const soundCloudUrl = 'https://soundcloud.com/*'
const togglePlaybackCommand = 'toggle-playback'
const previousSongCommand = 'previous-song'
const nextSongCommand = 'next-song'

async function openSoundCloud() {
  await browser.tabs.create({
    pinned: true,
    url: soundCloudUrl.replace('*', '')
  });
}

function scriptFor(command) {
  switch (command) {
    case togglePlaybackCommand:
      return scriptThatClicksOn('play');
    case previousSongCommand:
      return scriptThatClicksOn('prev');
    case nextSongCommand:
      return scriptThatClicksOn('next');
  }
}

function scriptThatClicksOn(actionName) {
  // console.log(`Got action: ${actionName}`);

  const script = function() {
    const button = document.querySelector(`.playControls .playControls__%a`);
    button.click();
  }

  return '(' + script.toString().replace('%a', actionName) + ')()'
}

async function executeCommand (command) {
  console.log('[SoundCloud control] executing command: ', command)
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) {
    openSoundCloud();
    return;
  }

  for (let tab of scTabs) {
    // console.log('tab', tab)
    browser.tabs.executeScript(tab.id, {
      runAt: 'document_start',
      code: scriptFor(command)
    });
  }
}

// // regular click on browser action toggles playback
browser.browserAction.onClicked.addListener(() => executeCommand(togglePlaybackCommand))

// context-click on browser action displays more options
browser.contextMenus.create({
  id: 'toggle-playback-menu-item',
  title: 'Toggle Playback',
  contexts: ['browser_action'],
  onclick: () => executeCommand(togglePlaybackCommand)
});

browser.contextMenus.create({
  id: 'previous-song-menu-item',
  title: 'Previous Song',
  contexts: ['browser_action'],
  onclick: () => executeCommand(previousSongCommand)
});

browser.contextMenus.create({
  id: 'next-song-menu-item',
  title: 'Next Song',
  contexts: ['browser_action'],
  onclick: () => executeCommand(nextSongCommand)
});
