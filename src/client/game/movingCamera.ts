import { rpc } from '../utils/rpc'

interface ICameraCoord {
    x: number;
    y: number;
    z: number;
    rot: number;
}

export interface IAllCameras {
    from: ICameraCoord
    to: ICameraCoord
    persCoord: ICameraCoord
    duration: number
}

let activeCamera: CameraMp | null = null;
let currentPath: IAllCameras | null = null;
let startTime: number = 0;

const lerp = (a: number, b: number, t: number): number => {
    return a + (b - a) * t;
};

export const createCamera = (pos: ICameraCoord, target: ICameraCoord) => {
    activeCamera = mp.cameras.new(
        'default',
        new mp.Vector3(pos.x, pos.y, pos.z),
        new mp.Vector3(0, 0, pos.rot),
        40
    );
    
    // Камера сразу смотрит на целевую точку (to)
    activeCamera.pointAtCoord(target.x, target.y, target.z);
    activeCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
};

let ev = null
export const startCamMoving = (path: IAllCameras) => {
    rpc.callServer('client:startNewCamera', [path.persCoord])

    currentPath = path;
    startTime = Date.now();

    if (ev) {
        ev.destroy();
    }

    createCamera(path.from, path.to);

    ev = new mp.Event("render", (player, reason, killer) =>
    {
        if (!activeCamera || !currentPath) return

        const now = Date.now()
        const progress = Math.min((now - startTime) / currentPath.duration, 1)

        const x = lerp(currentPath.from.x, currentPath.to.x, progress)
        const y = lerp(currentPath.from.y, currentPath.to.y, progress)
        const z = lerp(currentPath.from.z, currentPath.to.z, progress)

        activeCamera.setCoord(x, y, z);

        activeCamera.pointAtCoord(currentPath.to.x, currentPath.to.y, currentPath.to.z);

        if (progress >= 1) {
            stopCamMoving();
        }
    });
};

export const stopCamMoving = () => {
    if (ev) {
        ev.destroy()
        ev = null
    }
    destroyCamera();
};

export const destroyCamera = () => {
    if (activeCamera) {
        activeCamera.destroy();
        activeCamera = null;
    }
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
};