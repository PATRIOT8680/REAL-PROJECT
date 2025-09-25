import { store } from "../../store.ts";
import { IMsg } from "../../../views/AdminMenu/pages/Reports.tsx";

import {
  setReport,
  getReport,
  closeReport,
  addMessageToReport,
  updateReportStatus,
  updaterReportResponder
} from "../../../actions/elements/adminMenu/reportsList.ts";


export const reportsListStore = {
  setReport: (
      id: number,
      listMsg: IMsg[],
      status: 'waiting' | 'taken',
      responder: string
  ) => {
    store.dispatch(setReport(id, listMsg, status, responder))
  },

  getReport: () => {
    store.dispatch(getReport())
  },

  closeReport: (
    id: number,
  ) => {
    store.dispatch(closeReport(id))
  },

  addMessageToReport: (
    id: number,
    listMsg: IMsg,
  ) => {
    store.dispatch(addMessageToReport(id, listMsg))
  },

  updateReportStatus: (
    id: number,
    status: 'waiting' | 'taken',
    responder: string
  ) => {
    store.dispatch(updateReportStatus(id, status, responder))
  },

  updateReportResponder: (
    id: number,
    responder: string
  ) => {
    store.dispatch(updaterReportResponder(id, responder))
  },
}