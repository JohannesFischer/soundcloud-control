const soundCloudUrl = 'https://soundcloud.com/*';

async function executeCommand(subject) {
  const scTabs = await browser.tabs.query({ url: soundCloudUrl });

  if (scTabs.length === 0) return false;

  const payLoad = Object.assign({ from: 'command' }, subject);

  browser.tabs.sendMessage(scTabs[0].id, payLoad);
}

browser.commands.onCommand.addListener(function(command) {
  const commands = [
    'next-song',
    'previous-song',
    'toggle-playback'
  ];

  if (commands.includes(command)) {
    executeCommand({ subject: command });
  }
});
