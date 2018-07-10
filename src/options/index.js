import keycode from 'keycode'
import regexSort from 'regex-sort'

let commands = {}
const defaultCommands = {
  'next-song': 'Ctrl+Shift+7',
  'previous-song': 'Ctrl+Shift+5',
  'toggle-playback': 'Ctrl+Shift+6'
}
let recording = false

function testShortcut(shortcut) {
  if (Object.values(commands).includes(shortcut)) return false

  const shortCutPattern = [
    /^\s*(Alt|Ctrl|Command|MacCtrl)\s*\+\s*(Shift\s*\+\s*)?([A-Z0-9]|Comma|Period|Home|End|PageUp|PageDown|Space|Insert|Delete|Up|Down|Left|Right)\s*$/,
    /^\s*((Alt|Ctrl|Command|MacCtrl)\s*\+\s*)?(Shift\s*\+\s*)?(F[1-9]|F1[0-2])\s*$/,
    /^(MediaNextTrack|MediaPlayPause|MediaPrevTrack|MediaStop)$/
  ]

  return shortCutPattern.some(pattern => pattern.test(shortcut))
}

function getKeyName(which) {
  const keyname = keycode(which)

  if (keyname === ',') return 'comma'
  else if (keyname === '.') return 'period'

  return which === 224 ? 'Command' : keyname
}

function createShortcutString(input) {
  const keys = input.map(key => capitalize(getKeyName(key)))

  return regexSort(keys, [
    /(Alt|Ctrl|Command|MacCtrl)/,
    /Shift/,
    /([F[1-9]|F1[0-2]|A-Z0-9]|Comma|Period|Home|End|PageUp|PageDown|Space|Insert|Delete|Up|Down|Left|Right)/
  ]).join('+')
}

function recordKeys(button) {
  if (recording) return

  const commandName = button.getAttribute('data-command')
  recording = true
  setButtonText(commandName, 'Recording...')
  let keys = []
  let keyCount = 0

  const handleKeyDown = (e) => {
    e.preventDefault()

    if (getKeyName(e.which) === 'esc') {
      keyCount = 0
      return reset()
    }

    if (!keys.includes(e.which)) {
      keyCount++
      keys.push(e.which)
    }
  }

  const handleKeyUp = (e) => {
    keyCount--

    if (keyCount === 0) {
      reset()

      let shortcut = createShortcutString(keys)
      // console.log('You pressed: ', shortcut)

      if (testShortcut(shortcut)) {
        setCommand(commandName, shortcut)
      } else {
        handleShortCutError()
      }
    }
  }

  const reset = () => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    setButtonText(commandName, 'Click to set')
    recording = false
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
  showAlert('Failed to set shortcut.', 'error')
}

function setCommand(commandName, shortcut) {
  setButtonText(commandName, 'Setting shortcut')

  updateShortcut(commandName, shortcut)
    .then(() => saveCommand(commandName, shortcut))
    .catch(() => {
      handleShortCutError()
    })
}

function saveCommand(commandName, shortcut) {
  const command = {}
  command[commandName] = shortcut

  browser.storage.local.get('commands')
    .then(result => {
      const commands = Object.assign(result.commands || {}, command)

      browser.storage.local
        .set({
          commands
        })
        .then(() => {
          showAlert('Set shortcut successfully.', 'success')
          setButtonText(commandName, 'Click to set')
          setCommandText(commandName, shortcut)
          commands[commandName] = shortcut
        })
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
  browser.storage.local.get('commands')
    .then(result => {
      const commands = Object.keys(result.commands)
      let count = 0

      commands.forEach(commandName => {
        const shortcut = getCommand(commandName)

        browser.commands.reset(commandName)
          .then(() => {
            count++
            setCommandText(commandName, shortcut)

            if (count === commands.length) {
              browser.storage.local.clear()
            }
          })
      })
    })
}

// Init options

function initOptions(storageCommands) {
  // TODO: get browser commands
  commands = Object.assign(defaultCommands, storageCommands)

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

function showAlert(text, type) {
  const form = document.querySelector('form')

  const container = document.createElement('div')
  container.className = `alert ${type}`
  container.textContent = text

  form.parentNode.insertBefore(container, form)

  window.setTimeout(() => {
    document.querySelector('.alert').remove()
  }, 4000)
}

browser.storage.local.get('commands')
  .then(result => {
    initOptions(result.commands || {})
  })

document.querySelector('form > button').addEventListener('click', e => {
  e.preventDefault()
  resetCommands()
})
