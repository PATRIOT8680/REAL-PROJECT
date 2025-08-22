import { useState, useRef, useEffect, FormEvent, useCallback } from 'react'
import type { KeyboardEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../reducers/rootReducer'
import { rce } from "../../modules/rce.ts";
import './assets/style/compiled-css/Index.css'

import chat_svg from './assets/img/chat.svg'
import {CustomEventHandler} from "../../../../shared/CustomEventBase.ts";

const Chat = () => {
  let ev: CustomEventHandler
  const chatVisible = useSelector((state: RootState) => state.chatReducer.isVisible)
  const [chatActive, setChatActive] = useState<boolean>(false)
  const [buffer, setBuffer] = useState<string[]>([])
  const [currentBufferIndex, setCurrentBufferIndex] = useState<number>(-1)
  const [inputValue, setInputValue] = useState<string>('')
  const arrayActions = ['/do', '/me', '/try', '/todo', '']

  const chatboxRef = useRef<HTMLDivElement | null>(null)
  const msgRef = useRef<HTMLDivElement | null>(null)
  const msgListRef = useRef<HTMLDivElement | null>(null)
  const msgInputRef = useRef<HTMLDivElement | null>(null)
  const inputTextRef = useRef<HTMLInputElement | null>(null)
  const startChatboxActiveRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const blurRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      const scrollTop = msgListRef.current?.scrollTop || 0;
      const scrollHeight = msgListRef.current?.scrollHeight || 0;
      const clientHeight = msgListRef.current?.clientHeight || 0;

      const newScrollTop = scrollTop + event.deltaY

      msgListRef.current!.scrollTo({
        top: Math.min(Math.max(newScrollTop, 0), scrollHeight - clientHeight),
        behavior: 'smooth'
      })
    }

    const msgListElement = msgListRef.current;
    if (msgListElement) {
      msgListElement.addEventListener('wheel', handleWheel)
    }

    return () => {
      ev.destroy();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (msgListElement) {
        msgListElement.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  useEffect(() => {
    if (chatboxRef.current && blurRef.current) {
      if (chatActive) {
        chatboxRef.current.classList.add('active')
        blurRef.current.classList.add('active')

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else {
        timeoutRef.current = setTimeout(() => {
          chatboxRef.current?.classList.remove('active')
          blurRef.current?.classList.remove('active')
        }, 20000)
      }
    }
  }, [chatActive])

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
      }
    };

    const listElement = msgListRef.current;
    if (listElement) {
      listElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  //const handleMsgList = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //  if (e.key === ' ' || e.key === 'Spacebar') {
  //    e.preventDefault()
  //  }
  //};

  const colorify = (text: string) => {
		let matches: { found: string; index: number }[] = []
		let curPos = 0

		let m: RegExpExecArray | null
		do {
			m = /\{([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\}/g.exec(text.substr(curPos))

			if (!m) {
				break
			}

			matches.push({
				found: m[0],
				index: m.index + curPos,
			})

			curPos = curPos + m.index + m[0].length
		} while (m !== null)

		if (matches.length > 0) {
			for (let i = matches.length - 1; i >= 0; --i) {
				const color = matches[i].found.substring(1, matches[i].found.length - 1)
				const insertHTML = `<font color='#${color}'>`
				text =
					text.slice(0, matches[i].index) +
					insertHTML +
					text.slice(matches[i].index + matches[i].found.length)
			}
			text += '</font>'
		}

		return text
	}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const filteredValue = value.replace(/[\{#\}]/g, '')

    setInputValue(filteredValue)
  };

  const checkOverflow = () => {
    if (msgRef.current && msgListRef.current) {
      if (msgRef.current.clientHeight > msgListRef.current.clientHeight) {
        msgListRef.current.classList.add('overflowed')
      } else {
        msgListRef.current.classList.remove('overflowed')
      }
    }
  }

  const openChat = (insertSlash: boolean) => {
    if (startChatboxActiveRef.current) clearTimeout(startChatboxActiveRef.current)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    rce.triggerClient('cursorVisible', true)

    if (insertSlash) {
      setInputValue('/')
    }

    if (msgInputRef.current) {
      msgInputRef.current.style.display = 'block'
      msgInputRef.current.style.opacity = '1'
      msgInputRef.current.querySelector('input')?.focus()
    }

    setChatActive(true)
  }

  const closeChat = () => {
    if (chatVisible && msgInputRef.current) {
      msgInputRef.current.style.transition = 'none';
      msgInputRef.current.style.display = 'none';
      rce.triggerClient('cursorVisible', false)
      setChatActive(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    rce.triggerClient('chatmessage', inputValue)
    saveBuffer()
    closeChat()
    setInputValue('')
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const currentIndex = arrayActions.indexOf(inputValue.trim())
      const nextAction = (currentIndex + 1) % arrayActions.length
      
      if (arrayActions[nextAction] === '') {
        setInputValue('')
      } else {
        setInputValue(arrayActions[nextAction] + ' ')
      }
      
      inputTextRef.current?.focus()
    } 

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (currentBufferIndex > 0) {
        loadBuffer(currentBufferIndex - 1)
      } else if (currentBufferIndex === 0) {
        setCurrentBufferIndex(-1)
        setInputValue('')
      }
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (currentBufferIndex < buffer.length - 1) {
        loadBuffer(currentBufferIndex + 1)
      }
    }

    //if (event.code === 'Space') {
    //  event.preventDefault()
    //  return
    //}
  }

  const saveBuffer = () => {
    if (!inputValue) return

    if (buffer.length > 100) {
      buffer.pop()
    }

    setBuffer([inputValue, ...buffer])
    setCurrentBufferIndex(-1)
  }

  const loadBuffer = (id: number) => {
    setInputValue(buffer[id])
    setCurrentBufferIndex(id)
  }

  const highlightChat = () => {
    if (msgListRef.current) {
      msgListRef.current.scrollTo({
        left: 0,
        top: msgListRef.current.scrollHeight,
      })
    }
  }

  const getCurrentTimeInMoscow = () => {
		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'Europe/Moscow',
			hour: '2-digit' as '2-digit',
			minute: '2-digit' as '2-digit',
			hour12: false,
		}
		return new Intl.DateTimeFormat('ru-RU', options).format(new Date())
	}

  const addString = (text: string, showTime: boolean, tile?: string) => {
    if (msgRef.current && msgRef.current.children.length >= 10) {
      msgRef.current.removeChild(msgRef.current.children[0])
    }

    const msg = document.createElement('p')
    const time = getCurrentTimeInMoscow()
    msg.innerHTML = `${showTime ? `<span class="time">${time}</span>` : ''} ${tile ? `<span class="tile" id="${tile}">${tile.toUpperCase()}</span>` : '' } ${text}`
    msgRef.current?.appendChild(msg)
    checkOverflow()
    highlightChat()

    if (msgListRef.current) {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight
    }
  }

  const addMsg = useCallback((name: string, text: string, showTime: boolean, tile: string) => {
		const coloredText = colorify(text)
		addString(`<b>Гражданин #19383</b> • ${coloredText}`, true)
	}, [])

  const handleActionInput = (action: string) => {
    if (action === '') {
      setInputValue('');
    } else {
      setInputValue(action + ' ');
    }

    if (inputTextRef.current) {
      inputTextRef.current.focus()
    }
  }

  rce.triggerClient('chatloaded')
  ev = rce.register('chatActive', (isActive: boolean) => {
    setChatActive(isActive)
  });
  ev = rce.register('addString', (text: string, showTime: boolean, tile: string) =>
      addString(colorify(text), showTime, tile)
  );
  ev = rce.register('addMsg', addMsg);
  ev = rce.register('openChat', openChat);
  ev = rce.register('closeChat', closeChat);
  ev = rce.register('client:clearChat', () => {
    setBuffer([])
    if (msgRef.current) {
      msgRef.current.innerHTML = ''
    }
  });

  return (
		<>
			<div className='div-effect' ref={blurRef}></div>
			<div className='chatbox' ref={chatboxRef}>
        <span className='title'>Игровой чат</span>
				<div className='msgList' ref={msgListRef} tabIndex={0}>
					<div className='messages' ref={msgRef}>
						{/*<p><span className="tile" id='hello'>HELLO</span> <b>Ваше приключение начинается на X REDSTAR ROLEPLAY</b></p>
            <p>Этот слот пустой! Создайте нового персонажа и начните новую жизнь с чистого листа.
Создавайте его с умом, так как потом не изменить!</p>
            <p>Чтобы продолжить игру, введите свои данные от аккаунты</p>
            <p>Создавая персонажа, учитывайте, что больше изменить внешность не сможете, за исключением покупки за RED COINS</p>
            <p>Этот слот пустой! Создайте нового персонажа и начните новую жизнь с чистого листа.
Создавайте его с умом, так как потом не изменить!</p>
<p>Этот слот пустой! Создайте нового персонажа и начните новую жизнь с чистого листа.
Создавайте его с умом, так как потом не изменить!</p>
<p>Этот слот пустой! Создайте нового персонажа и начните новую жизнь с чистого листа.
Создавайте его с умом, так как потом не изменить!</p>*/}
					</div>
				</div>
				<div
					className='msgInput'
					ref={msgInputRef}
					style={{ display: chatActive ? 'block' : 'none' }}
				>
					<form id='message' onSubmit={handleSubmit}>
						<div className='input-block'>
							<img src={chat_svg} />
							<input
								type='text'
								spellCheck='false'
								value={inputValue}
								onChange={handleInputChange}
								placeholder='Введите сообщение...'
								onKeyDown={handleKeyDown}
                ref={inputTextRef}
                autoFocus={true}
							/>
						</div>
						<div className='action-btns'>
              <span>TAB</span>
							<button className='action' type='button' onClick={() => handleActionInput('/do')}>DO</button>
							<button className='action' type='button' onClick={() => handleActionInput('/me')}>ME</button>
							<button className='action' type='button' onClick={() => handleActionInput('/try')}>TRY</button>
							<button className='action' type='button' onClick={() => handleActionInput('/todo')}>TODO</button>
              <button className='action' type='button' onClick={() => handleActionInput('')}>IC</button>
						</div>
            {/*<span className='help-action'><span>TAB</span> <span>быстрая смена команды</span></span>*/}
					</form>
				</div>
			</div>
		</>
	)
}

export default Chat