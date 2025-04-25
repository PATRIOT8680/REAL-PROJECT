import * as native from 'natives-ragemp'

const requestAnimDict = (dict: string, callback) => {
  mp.game.streaming.requestAnimDict(dict);
  
  const checkLoad = () => {
    if (native.hasAnimDictLoaded(dict)) {
      if (callback) callback()
    } else {
      setTimeout(checkLoad, 0)
    }
  };

  checkLoad()
};


export const toogleAnim = (toggle, animDict, animName, duration) => {
  if (toggle === true) {
    requestAnimDict(animDict, () => {
      mp.players.local.taskPlayAnim(animDict, animName, 1, 1, duration, 1, 1, false, false, false)
    });
  } else {
    mp.players.local.clearTasks()
    mp.players.local.clearSecondaryTask()
  }
};