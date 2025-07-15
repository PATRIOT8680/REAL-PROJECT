import { rpc } from '../../utils/rpc'
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

rpc.register('toggleInterface', (interfaceName: string, isVisible: boolean, duration?: number) => {
    setTimeout(() => {
      mp.gui.cursor.show(true, true);
    }, 500)
    mp.gui.cursor.visible = true
    rpc.callBrowser(`cef:${isVisible ? 'show' : 'hide'}${interfaceName}`, [duration]);
    handleInterfaceVisibility(interfaceName, isVisible);
});


mp.keys.bind(Keys.VK_OEM_3, true, () => {
  const visibleCursor = false

  setTimeout(() => {
    mp.gui.cursor.show(!visibleCursor, !visibleCursor)
  }, 100)
})
//mp.events.call('toggleInterface', 'Auth', true)
//mp.events.call('toggleInterface', 'Chat', true)