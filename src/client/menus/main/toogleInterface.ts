import { rce } from '../../utils/rce'
import Keys from '../../utils/keys'

export const openInterfaces = new Set()
export const isInterfaceVisible = (interfaceName: string) => {
  return openInterfaces.has(interfaceName)
}

const handleInterfaceVisibility = (interfaceName: string, isVisible: boolean) => {
    mp.console.logInfo(`Interface: ${interfaceName}, Visible: ${isVisible}`);

    if (isVisible) {
      openInterfaces.add(interfaceName);
    } else {
      openInterfaces.delete(interfaceName)
    }
};

rce.registerAll('toggleInterface', (interfaceName: string, isVisible: boolean, duration?: number) => {
  setTimeout(() => {
    mp.gui.cursor.show(true, true);
  }, 500)
  mp.gui.cursor.visible = true
  rce.triggerCef(`cef:${isVisible ? 'show' : 'hide'}${interfaceName}`, duration);
  handleInterfaceVisibility(interfaceName, isVisible);
})