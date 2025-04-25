export type TypeNotify = 'info' | 'warning' | 'err' | 'success'
export type TypePos = 'bottom' | 'top' | 'left' | 'right'

export const sendNotify = (typeNotify: TypeNotify, msg: string, duration: number, pos: TypePos) => {
  return { type: 'SEND_NOTIFY', typeNotify, msg, duration, pos };
};

export const removeNotify = (id: string) => {
  return {
    type: 'REMOVE_NOTIFY',
    id
  }
}