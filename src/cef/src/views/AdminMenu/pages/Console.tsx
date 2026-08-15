import './assets/styles/compiled-css/Console.css'
import {useEffect, useRef, useState, KeyboardEvent} from "react"
import { useSelector } from "react-redux";
import { rce } from "../../../modules/rce.ts"
import { getDateTime } from "../../../modules/dateTime.ts";
import {RootState} from "../../../reducers/rootReducer.ts";

interface CommandArg {
  name: string
  type: 'string' | 'number' | 'boolean' | 'player' | 'duration' | 'text'
  optional?: boolean
}

interface CommandDefinition {
  name: string
  description: string
  args: CommandArg[],
  adminLvl: number
}

export interface ConsoleMessage {
  id: number
  sender: string
  time: string | undefined
  args: string[]
  isError?: boolean
}

interface Suggestion {
  command: string
  args: string[]
  description: string
}

const ConsolePage = () => {
  const consoleBufferState = useSelector((state: RootState) => state.consoleBufferReducer)
  const { nickname } = useSelector((state: RootState) => state.playerInfoReducer)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const selectedSuggestionRef = useRef<HTMLDivElement>(null);
  const [cmdValue, setCmdValue] = useState<string>('')
  const [commands, setCommands] = useState<CommandDefinition[]>([])
  const [messages, setMessages] = useState<ConsoleMessage[]>([])
  const [messageId, setMessageId] = useState(0)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1)
  const [openedHelps, setOpenedHelps] = useState<boolean>(false)
  const [playerInfo, setPlayerInfo] = useState({ name: 'Admin', id: '00000' })
  const [formattedTime, setFormattedTime] = useState<string>('')

  rce.register('console:setCommands', (serverCommands: CommandDefinition[]) => {
    rce.triggerClient('clientCmd', 'Зарегали команду')
    setCommands(serverCommands)
  })

  rce.register('console:commandResponse', (success: boolean, message: string) => {
    const currentTime = getDateTime()

    const serverMessage: ConsoleMessage = {
      id: messageId,
      sender: 'Server',
      time: currentTime,
      args: [message],
      isError: !success
    };

    setMessages(prev => [...prev, serverMessage])
    setMessageId(prev => prev + 1)
  })

  useEffect(() => {
    setMessages(consoleBufferState)
    const maxId = Math.max(...consoleBufferState.map((msg: ConsoleMessage)  => msg.id), 0)
    setMessageId(maxId + 1)
    rce.triggerServer('console:getCommands')
    rce.triggerClient('clientCmd', 'Запросили команды')
  }, [])

  useEffect(() => {
    return () => {
      window.App.consoleBufferReducer.setBufferConsole(messages)
    }
  }, [messages])


  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 550)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    updateSuggestions(cmdValue)
  }, [cmdValue, commands])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([])
        setSelectedSuggestion(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selectedSuggestion >= 0 && selectedSuggestionRef.current) {
      selectedSuggestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [selectedSuggestion])

  const updateSuggestions = (input: string) => {
    if (!input.trim()) {
      setSuggestions([])
      setSelectedSuggestion(-1)
      return
    }

    const inputParts = input.trim().split(/\s+/)
    const commandPart = inputParts[0].toLowerCase()

    const matchedCommands = commands.filter(cmd =>
        cmd.name.toLowerCase().startsWith(commandPart)
    )

    const newSuggestions = matchedCommands.map((cmd: CommandDefinition) => {
      const argsDisplay = cmd.args.map(arg => {
        return arg.optional ? `[${arg.name}]` : `<${arg.name}>`
      })

      return {
        command: cmd.name,
        args: argsDisplay,
        description: cmd.description,
      }
    })

    setSuggestions(newSuggestions)
    setSelectedSuggestion(newSuggestions.length > 0 ? 0 : -1)
  }

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    const inputParts = cmdValue.trim().split(/\s+/);
    const existingArgs = inputParts.length > 1 ? inputParts.slice(1) : [];

    const newValue = `${suggestion.command} ${existingArgs.join(' ')}`
    setCmdValue(newValue);
    setSuggestions([]);
    setSelectedSuggestion(-1);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const parseCommand = (input: string) => {
    const tokens = input.trim().split(/\s+/)
    const commandName = tokens[0].toLowerCase()
    const args = tokens.slice(1)

    return { commandName, args }
  }

  const validateCmd = (cmdName: string, args: string[]) => {
    const command = commands.find(cmd => cmd.name === cmdName)

    if (!command) return { isValid: false, error: `Команда "${cmdName}" не найдена!` }

    const requiredArgs = command.args.filter(arg => !arg.optional)

    // if (args.length < requiredArgs.length || args.length > requiredArgs.length) return { isValid: false, error: `Недостаточно аргументов! Ожидается: ${requiredArgs.length}, а получено: ${args.length}` }

    return { isValid: true }
  }

  const handleCmdSubmit = async () => {
    if (!cmdValue.trim()) return

    const { commandName, args } = parseCommand(cmdValue)
    const validation = validateCmd(commandName, args)
    const currentTime = await getDateTime()

    const userMsg: ConsoleMessage = {
      id: messageId,
      sender: nickname,
      time: currentTime,
      args: [commandName, ...args]
    }

    setMessages(prev => [...prev, userMsg])
    setMessageId(prev => prev + 1)

    if (!validation.isValid) {
      setTimeout(() => {
        const errorMessage: ConsoleMessage = {
          id: messageId + 1,
          sender: 'Server',
          time: currentTime,
          args: [validation.error || 'Неизвестная ошибка валидации'],
          isError: true
        }

        setMessages(prev => [...prev, errorMessage])
        setMessageId(prev => prev + 2)
      }, 500)

      setCmdValue('')
      return
    }

    rce.triggerServer('console:executeCommand', commandName, args)
    setCmdValue('')
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Если есть выбранная подсказка И текст в инпуте ещё не полностью введён вручную
      if (selectedSuggestion >= 0 && suggestions.length > 0) {
        const selectedCmd = suggestions[selectedSuggestion].command;

        // Если пользователь уже ввёл полную команду — отправляем сразу
        if (cmdValue.trim().toLowerCase().startsWith(selectedCmd.toLowerCase() + ' ') ||
          cmdValue.trim().toLowerCase() === selectedCmd.toLowerCase()) {
          handleCmdSubmit();
        } else {
          // Иначе — просто вставляем подсказку
          handleSuggestionSelect(suggestions[selectedSuggestion]);
        }
      } else {
        // Нет активной подсказки — сразу отправляем
        handleCmdSubmit();
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedSuggestion(-1);
    }
    else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      if (selectedSuggestion >= 0) {
        handleSuggestionSelect(suggestions[selectedSuggestion]);
      }
    }
  };

  const getTime = async () => {
    return await getDateTime()
  }

  const handleSelectHelpCmd = (cmdName: string) => {
    setCmdValue(`${cmdName} `)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <>
      <div className="console-page">
        <div className="msg-container">
          <div className="msg" id="server">
            <div className="header-msg">
              <span className="name">Административные команды</span>
              <span className="time"></span>
            </div>
            <div className="text-block" id='help-text'>
              <ul className={`list-cmds ${openedHelps ? '' : 'closed'}`}>
                <span className="info-opened" onClick={() => setOpenedHelps(!openedHelps)}>{ !openedHelps ? 'Открыть список команд ▼' : 'Закрыть список команд ▲' }</span>

                { openedHelps && (
                    <div className="cmds">
                      { commands.map((cmd, key) => (
                        <li className="cmd-btn" onClick={() => handleSelectHelpCmd(cmd.name)}>{cmd.description} ({cmd.adminLvl} lvl)</li>
                      ))}
                    </div>

                  )
                }

              </ul>
            </div>

          </div>

          { messages.map(msg => (
            <div className="msg" id={msg.sender === 'Server' ? 'server' : 'you'} key={msg.id}>
              <div className="header-msg">
                <span className="name">{ msg.sender }</span>
                <span className="time">{ msg.time }</span>
              </div>
              <div className="text-block">
                { msg.args.map((arg, key) => (
                    <span className={`arg ${msg.isError ? 'error' : ''}`} key={key} >
                      {arg}
                    </span>
                )) }
              </div>
            </div>
          )) }

          <div ref={messagesEndRef} />
        </div>

        <div className="input-cmds-section">
          {suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions-container">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.command}
                  ref={index === selectedSuggestion ? selectedSuggestionRef : null}
                  className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="suggestion-command">
                    <span className="command-name">{suggestion.command}</span>
                    {suggestion.args.map((arg, argIndex) => (
                      <span key={argIndex} className="command-arg">{arg}</span>
                    ))}
                  </div>
                  <div className="suggestion-description">{suggestion.description}</div>
                </div>
              ))}
            </div>
          )}
          <div className="enter-block">
            <input
              ref={inputRef}
              type='text'
              value={cmdValue}
              onKeyDown={handleKeyPress}
              onChange={(e) => setCmdValue(e.target.value)}
              className='enter-cmd'
              placeholder='Начните вводить команду...'
            />

            { cmdValue !== '' && (
              <span className="enter-keyup">ENTER</span>
            ) }
          </div>
        </div>
      </div>
    </>
  )
}

export default ConsolePage