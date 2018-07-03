import keycode from 'keycode'

const defaultCommands = {
  'next-song': 'Ctrl+Shift+7',
  'previous-song': 'Ctrl+Shift+5',
  'toggle-playback': 'Ctrl+Shift+6'
}

const shortCutPattern = [
  /^\s*(Alt|Ctrl|Command|MacCtrl)\s*\+\s*(Shift\s*\+\s*)?([A-Z0-9]|Comma|Period|Home|End|PageUp|PageDown|Space|Insert|Delete|Up|Down|Left|Right)\s*$/,
  /^\s*((Alt|Ctrl|Command|MacCtrl)\s*\+\s*)?(Shift\s*\+\s*)?(F[1-9]|F1[0-2])\s*$/,
  /^(MediaNextTrack|MediaPlayPause|MediaPrevTrack|MediaStop)$/
]

function testShortcut(shortcut) {
  return shortCutPattern.some(pattern => pattern.test(shortcut))
}

function recordKeys(button) {
  const commandName = button.getAttribute('data-command')
  setButtonText(commandName, 'Recording...')
  let keys = []
  let keyCount = 0

  const handleKeyDown = (e) => {
    e.preventDefault()

    if (!keys.includes(e.which)) {
      keyCount++
      // console.log(keycode(e.which))
      keys.push(e.which)
    }
  }

  const handleKeyUp = (e) => {
    keyCount--

    if (keyCount === 0) {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      // TODO: handle MacCtrl 224
      let shortcut = keys.map(key => capitalize(keycode(key))).join('+')
      console.log('You pressed: ', shortcut)
      setButtonText(commandName, 'Click to set')

      if (testShortcut(shortcut)) {
        setCommand(commandName, shortcut)
      } else {
        handleShortCutError()
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
}

function setButtonText(commandName, text) {
  const button = getButton(commandName)
  button.textContent = text
}

function updateShortcut(commandName, shortcut) {
  return browser.commands.update({
    name: commandName,
    shortcut
  })
}

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1)
}

function handleShortCutError() {
  console.error('failed setting shortcut')
}

function setCommand(commandName, shortcut) {
  setButtonText(commandName, 'Setting shortcut')

  updateShortcut(commandName, shortcut)
    .then(() => saveCommand(commandName, shortcut))
    .catch(error => {
      console.error(error)
      handleShortCutError()
    })
}

function saveCommand(commandName, shortcut) {
  const commands = {}
  commands[commandName] = shortcut
  console.log('setting: ', commands)

  browser.storage.local
    .set({
      commands
    })
    .then(() => {
      setButtonText(commandName, 'Click to set')
      setCommandText(commandName, shortcut)
    })
}

function getButton(commandName) {
  return document.querySelector(`button[data-command=${commandName}`)
}

function setCommandText(commandName, shortcut) {
  const button = getButton(commandName)
  button.previousElementSibling.textContent = shortcut
}

function getCommand(commandName) {
  return defaultCommands[commandName]
}

function resetCommands() {
  Object.keys(defaultCommands).forEach(commandName => {
    const shortcut = getCommand(commandName)

    browser.commands.reset(commandName)
      .then(() => setCommandText(commandName, shortcut))
  })

  browser.storage.local.clear()
}

// Init options

function initOptions(storageCommands) {
  // TODO: get browser commands
  const commands = Object.assign(defaultCommands, storageCommands)

  Object.keys(defaultCommands).forEach(commandName => {
    const shortcut = commands[commandName]
    const button = getButton(commandName)
    button.removeAttribute('disabled')
    button.addEventListener('click', e => {
      e.preventDefault()
      recordKeys(e.target)
    })

    setCommandText(commandName, shortcut)
  })
}

browser.storage.local.get('commands')
  .then(result => {
    console.log(result)
    initOptions(result.commands || {})
  })

document.querySelector('form > button').addEventListener('click', e => {
  e.preventDefault()
  resetCommands()
})
