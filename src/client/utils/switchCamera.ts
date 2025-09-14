export const destroyCamera = (camera: CameraMp) => {
  if (camera && mp.cameras.exists(camera)) {
    try {
      camera.destroy();
    } catch (e) {
      mp.console.logInfo(`Ошибка при уничтожении камеры: ${e}`);
    }
  }
}

export const createCamera = (position: Vector3, rotation: Vector3, fov: number): CameraMp => {
  try {
    return mp.cameras.new('default', position, rotation, fov);
  } catch (e) {
    mp.console.logInfo(`Ошибка при создании камеры: ${e}`);
    return null;
  }
}