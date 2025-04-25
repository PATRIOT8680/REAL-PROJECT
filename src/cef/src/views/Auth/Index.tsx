import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { rpc } from '../../main'

import { hideAuth } from '../../actions/menus/auth'

import './assets/styles/compiled-css/Index.css'

import Login from './elements/Login'
import Register from './elements/Register'
import Recovery from './elements/Recovery'

import polygon from './assets/img/polygon.svg'
import elipse from './assets/img/elipse.svg'
import rectangle from './assets/img/rectangle.svg'

import audio1 from './assets/audio/sound1.mp3'
import audio2 from './assets/audio/sound2.mp3'
import audio3 from './assets/audio/sound3.mp3'
import audio4 from './assets/audio/sound4.mp3'
import audio5 from './assets/audio/sound5.mp3'
import audio6 from './assets/audio/sound6.mp3'
import audio7 from './assets/audio/sound7.mp3'

export interface IPropsAuth {
	setCurrentForm: (newForm: 'login' | 'register' | 'recovery') => void
}

const Auth = () => {
	const dispatch = useDispatch()
	const [currentForm, setCurrentForm] = useState<'login' | 'register' | 'recovery'>('login')

  rpc.register('server:auth:loggingAuth', (message: string) => {
    rpc.callClient('clientCmd', [`${message}`])
    return
  })

	return (
		<>
			<div className='auth'>
				<form className={`form-block ${currentForm}`}>
					<div className='effects'>
						<div className='blurs'>
							<svg
								id='one-blur'
								width='272'
								height='264'
								viewBox='0 0 272 264'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<ellipse
									cx='136'
									cy='132'
									rx='136'
									ry='132'
									fill='#E11D40'
									fillOpacity='0.28'
								/>
							</svg>
							<svg
								id='two-blur'
								width='272'
								height='264'
								viewBox='0 0 272 264'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<ellipse
									cx='136'
									cy='132'
									rx='136'
									ry='132'
									fill='#E11D40'
									fillOpacity='0.28'
								/>
							</svg>
						</div>
						<div className='shapes'>
							<img id='polygon' src={polygon} />
							<img id='elipse' src={elipse} />
							<img id='rectangle' src={rectangle} />
							<img id='polygon-2' src={polygon} />
						</div>
					</div>
					{currentForm === 'login' && <Login setCurrentForm={setCurrentForm} />}
					{currentForm === 'register' && (
						<Register setCurrentForm={setCurrentForm} />
					)}
					{currentForm === 'recovery' && (
						<Recovery setCurrentForm={setCurrentForm} />
					)}
				</form>
			</div>
		</>
	)
}

export default Auth
