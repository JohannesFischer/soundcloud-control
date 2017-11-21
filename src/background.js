'use strict';

/* eslint-env browser, webextensions */

const soundCloudUrl = 'https://soundcloud.com/*'
const likeCurrentCommand = 'like-song';
const nextSongCommand = 'next-song';
const previousSongCommand = 'previous-song';
const togglePlaybackCommand = 'toggle-playback';

async function openSoundCloud() {
  await browser.tabs.create({
    pinned: true,
    url: soundCloudUrl.replace('*', '')
  });
}

function scriptFor(command) {
  switch (command) {
    case togglePlaybackCommand:
      return playerControl('play');
    case previousSongCommand:
      return playerControl('prev');
    case nextSongCommand:
      return playerControl('next');
    case likeCurrentCommand:
      return likeCurrentSong();
  }
}

function createScript(func, actionName = '') {
  let script = func.toString();

  if (actionName !== '') {
    script = script.replace('%a', actionName);
  }

  return `(${script})()`;
}

function likeCurrentSong() {
  const func = () => {
    const button = document.querySelector('.playControls__soundBadge .sc-button-like:not(.sc-button-selected)');

    if (button) {
      button.click();
    }
  }

  return createScript(func);
}

function playerControl(actionName) {
  const func = () => {
    const button = document.querySelector(`.playControls .playControls__%a`);
    button.click();
  }

  console.log(actionName, func)
  return createScript(func, actionName);
}

async function executeCommand (command) {
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) {
    openSoundCloud();
    return;
  }

  for (let tab of scTabs) {
    browser.tabs.executeScript(tab.id, {
      runAt: 'document_start',
      code: scriptFor(command)
    });
  }
}

// Click on browser action toggles playback
browser.browserAction.onClicked.addListener(() => executeCommand(togglePlaybackCommand));

// Context-click on browser action displays more options
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

browser.contextMenus.create({
  id: 'like-song-menu-item',
  title: 'Like Current Song',
  contexts: ['browser_action'],
  onclick: () => executeCommand(likeCurrentCommand)
});
