import { rce } from "./rce";

const CameraRotator = () => {
  let camera = null
  let basePosition = null
  let lookAtPosition = null
  let offsetVector = null
  let heading = 0
  let baseHeading = 0
  let currentPoint = { x: 0, y: 0 }
  let isPause = false
  let zUp = 0
  let zUpMultipler = 1
  let xBound = [0, 360]
  let zBound = [-0.08, 1]
  let offsetMultipler = 0
  let offsetBound = [3, 4]
  let isActive = false
  let mouseSensitivity = 1.5;


  const normilizeHeading = (heading) => {
    if (heading > 360) {
      heading = heading - 360
    } else if (heading < 0) {
      heading = 360 + heading
    }
    return heading
  };

  const changePosition = () => {
    const position = mp.game.object.getObjectOffsetFromCoords(
        basePosition.x,
        basePosition.y,
        basePosition.z + zUp,
        heading,
        offsetVector.x,
        offsetVector.y,
        offsetVector.z
    );
    camera.setCoord(position.x, position.y, position.z);
  };

  const start = (cam, bPosition, lAtPosition, oVector, h, fov = undefined) => {
    camera = cam
    basePosition = bPosition
    lookAtPosition = lAtPosition
    offsetVector = oVector
    heading = h
    baseHeading = h
    offsetMultipler = oVector.y

    changePosition()
    camera.pointAtCoord(lAtPosition.x, lAtPosition.y, lAtPosition.z)

    if (fov) {
      camera.setFov(fov)
    }

    activate(true)
  };

  const pause = (state) => {
    isPause = state
  }

  const stop = () => {
    activate(false)
  }

  const reset = () => {
    heading = baseHeading
    zUp = 0
    changePosition()
  }

  const setXBound = (min, max) => {
    xBound = [min, max]
  }

  const setOffsetBound = (min, max) => {
    offsetBound = [min, max]
  }

  const setZBound = (min, max) => {
    zBound = [min, max]
  }

  const setZUpMultipler = (value) => {
    zUpMultipler = value
  }

  const getRelativeHeading = () => {
    return normilizeHeading(baseHeading - heading);
  }

  const activate = (state) => {
    isActive = state
  }

  const onMouseScroll = (scrollDelta) => {
    // scrollDelta: 1 = скролл вверх (отдаление), -1 = скролл вниз (приближение)
    const sensitivity = 0.1;
    offsetMultipler -= scrollDelta * sensitivity;

    // Ограничения
    offsetMultipler = Math.max(offsetBound[0], Math.min(offsetBound[1], offsetMultipler));

    // Меняем ТОЛЬКО расстояние (Y компонент), не трогаем X и Z!
    offsetVector = new mp.Vector3(
        offsetVector.x,        // Боковое смещение (не меняем)
        offsetMultipler,       // Расстояние (меняем)
        offsetVector.z         // Высота (не меняем)
    );

    changePosition();
  };

  const onMouseMove = (dX, dY) => {
    heading = normilizeHeading(heading + dX * 100 * mouseSensitivity);

    let relativeHeading = getRelativeHeading()

    if (xBound[0] !== -360 && xBound[1] !== 360) {
      if (relativeHeading > xBound[0] && relativeHeading < xBound[1]) {
        relativeHeading =
            Math.abs(xBound[0] - relativeHeading) >
            Math.abs(xBound[1] - relativeHeading)
                ? xBound[1]
                : xBound[0]
      }
    }

    heading = normilizeHeading(-relativeHeading + baseHeading);
    zUp += dY * zUpMultipler * -1 * mouseSensitivity;

    if (zUp > zBound[1]) {
      zUp = zBound[1]
    } else if (zUp < zBound[0]) {
      zUp = zBound[0]
    }

    changePosition()
  }

  const setMouseSensitivity = (value) => {
    mouseSensitivity = value;
  };

  const isPointEmpty = () => {
    return currentPoint.x === 0 && currentPoint.y === 0;
  }

  const setPoint = (x, y) => {
    currentPoint = { x, y }
  }

  const getPoint = () => {
    return currentPoint
  }

  const createCam = (a, b, c) => {
    const entityPos = b
    start(
        a,
        entityPos,
        entityPos,
        new mp.Vector3(-2.7, 3.0, 1),
        c
    )
    setZBound(-0.8, 1.8)
    setZUpMultipler(5)
    pause(true)
  }

  return {
    start,
    pause,
    stop,
    reset,
    setXBound,
    setOffsetBound,
    setZBound,
    setZUpMultipler,
    onMouseScroll,
    onMouseMove,
    isPointEmpty,
    setPoint,
    getPoint,
    setMouseSensitivity,
    createCam,
    get isActive() { return isActive; },
    get isPause() { return isPause; }
  }
}

const cameraRotator = CameraRotator()

mp.events.add("render", () => {
  if (!mp.gui.cursor.visible || !cameraRotator.isActive) {
    return
  }

  const x = mp.game.controls.getDisabledControlNormal(2, 239)
  const y = mp.game.controls.getDisabledControlNormal(2, 240)

  if (cameraRotator.isPointEmpty()) {
    cameraRotator.setPoint(x, y)
  }

  const currentPoint = cameraRotator.getPoint()
  const dX = currentPoint.x - x
  const dY = currentPoint.y - y

  cameraRotator.setPoint(x, y)

  if (!cameraRotator.isPause) {
    if (mp.game.controls.isDisabledControlPressed(2, 237)) {
      cameraRotator.onMouseMove(dX, dY);
    }

    // ПРАВИЛЬНАЯ обработка скролла
    if (mp.game.controls.isDisabledControlJustPressed(2, 14)) { // Скролл вверх
      cameraRotator.onMouseScroll(-1);  // Было 1, стало -1
    } else if (mp.game.controls.isDisabledControlJustPressed(2, 15)) { // Скролл вниз
      cameraRotator.onMouseScroll(1);   // Было -1, стало 1
    }
  }
});

rce.registerAll('pauseCameraRotator', (toggle: boolean) => {
  cameraRotator.pause(toggle)
})

export { cameraRotator }