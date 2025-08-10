import { useEffect, useState, useMemo } from "react";
import { Howl, Howler } from 'howler'

const AUDIO_PATH = './assets/audio/auth_ambient/'
const AUDIO_FILES = ['bymyside.mp3', 'dawnofchange.mp3', 'echoofsadness.mp3', 'hope.mp3', 'slowlife.mp3', 'smalljoys.mp3']

const useMenuAmbients = () => {
  const [currentSound, setCurrentSound] = useState<Howl | null>(null)
  const [lastPlayedIndex, setPlayedIndex] = useState<number | null>(null)

  const sounds = useMemo(() => AUDIO_FILES.map(file => 
    new Howl({
      src: [AUDIO_PATH + file],
      volume: 0.05,
      loop: false,
      preload: true
    })
  ), [])

  useEffect(() => {
    if(!currentSound) return

    const onEnd = () => playRandomAmbient(true)
    currentSound.on('end', onEnd)

    return () => {
      currentSound.off('end', onEnd)
    }
  }, [currentSound])
  

  const playRandomAmbient = (excludeLast: boolean = false) => {
    currentSound?.stop()

    let availableIndices = sounds.map((_, i) => i)
    if (excludeLast && lastPlayedIndex !== null) {
      availableIndices = availableIndices.filter(i => i !== lastPlayedIndex);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    const sound = sounds[randomIndex]

    sound.play()
    setCurrentSound(sound)
    setPlayedIndex(randomIndex)
  }

  const stopAmbient = () => {
    currentSound?.stop()
    setCurrentSound(null)
  }

  useEffect(() => {
    return () => {
      sounds.forEach(sound => sound.unload())
    }
  }, [])

  return { playRandomAmbient, stopAmbient }
}

export default useMenuAmbients