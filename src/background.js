import { commands, executeCommand } from './lib.js'

browser.commands.onCommand.addListener((command) => {
  if (!Object.values(commands).includes(command)) return

  executeCommand({ from: 'command', subject: command })
})
