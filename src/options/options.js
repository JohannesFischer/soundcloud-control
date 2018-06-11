import keycode from 'keycode'

const defaultCommands = {
  'next-song': 'Ctrl+Shift+7',
  'previous-song': 'Ctrl+Shift+5',
  'toggle-playback': 'Ctrl+Shift+6'
}

function recordKeys(button) {
  // TODO: handle errors
  const command = button.getAttribute('data-command')
  button.textContent = 'Recording...'
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
      const shortCut = keys.map(key => capitalize(keycode(key))).join('+')
      console.log('You pressed: ', shortCut)
      button.textContent = 'Click to set'
      setCommand(command, shortCut)
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
}

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1)
}

function setCommand(cmd, kbCmd) {
  const button = document.querySelector(`button[data-command=${cmd}`)

  const text = kbCmd || getCommand(button)
  button.previousElementSibling.textContent = text
}

function getCommand(button) {
  const cmd = button.getAttribute('data-command')
  return defaultCommands[cmd]
}

function resetCommands() {
  document.querySelectorAll('form div button').forEach(button => {
    const cmd = button.getAttribute('data-command')
    setCommand(cmd, defaultCommands.cmd)
  })
}

document.querySelectorAll('form div button').forEach(button => {
  const cmd = button.getAttribute('data-command')
  setCommand(cmd)

  button.addEventListener('click', e => {
    e.preventDefault()
    recordKeys(e.target)
  })
})

document.querySelector('form > button').addEventListener('click', e => {
  e.preventDefault()
  resetCommands()
})
