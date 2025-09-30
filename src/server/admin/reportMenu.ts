import { rce } from "../utils/rce";
import {getDateTime} from "../../cef/src/modules/dateTime";
import { connectedUsers } from "../data/dataConnectedUser";

interface IData {
  nickName: string,
  text: string,
  dateTime: string,
  role: 'player' | 'admin',
}

rce.registerCef('cef:report:createReport', (player: PlayerMp, data: IData) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.setReport([{
    nickName: "${data.nickName}",
    text: "${data.text}",
    dateTime: "${data.dateTime}",
    role: "${data.role}"
  }], 'waiting')`)
})

rce.registerCef('cef:report:addMsg', (player: PlayerMp, id: number, data: IData) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.addMessageToReport(${id}, {
    nickName: "${data.nickName}",
    text: "${data.text}",
    dateTime: "${data.dateTime}",
    role: "${data.role}"
  })`)
})

rce.registerCef('cef:report:deleteReport', (player: PlayerMp, id: number, nickname: string) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.closeReport(${id})`)
})

rce.registerCef('cef:amenu:selectReport', (player: PlayerMp, id: number, nickname: string, adminNickname: string) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.updateReportStatus(${id}, "taken", "${adminNickname}")`)
})

rce.registerCef('cef:amenu:delayReport', (player: PlayerMp, id: number, nickname: string) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.updateReportStatus(${id}, "waiting")`)
})

rce.registerCef('cef:amenu:closeReport', (player: PlayerMp, id: number, nickname: string) => {
  const targetId = connectedUsers.getPlayerIdByNickName(nickname)
  const target = mp.players.at(targetId)
  rce.triggerClient(target, 'sendNotify', 'info', `Администратор закрыл ваш репорт`, 3300, 'top')
  rce.triggerClients('execute', `window.App.reportsListReducer.updateReportStatus(${id}, "reviewed")`)
})

rce.registerCef('cef:amenu:sendAMsg', (player: PlayerMp, id: number, data: IData) => {
  const targetId = connectedUsers.getPlayerIdByNickName(data.nickName)
  const target = mp.players.at(targetId)
  rce.triggerClient(target, 'sendNotify', 'info', `На ваш репорт пришёл ответ!`, 3300, 'top')

  rce.triggerClients('execute', `window.App.reportsListReducer.addMessageToReport(${id}, {
    nickName: "${data.nickName}",
    text: "${data.text}",
    dateTime: "${data.dateTime}",
    role: "${data.role}"
  })`)
})