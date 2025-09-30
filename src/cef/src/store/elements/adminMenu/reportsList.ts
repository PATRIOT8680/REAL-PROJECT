import { store } from "../../store.ts";
import { IMsg } from "../../../views/AdminMenu/pages/Reports.tsx";

import {
  setReport,
  getReport,
  closeReport,
  addMessageToReport,
  updateReportStatus,
} from "../../../actions/elements/adminMenu/reportsList.ts";


export const reportsListStore = {
  setReport: (
    listMsg: IMsg[],
    status: 'waiting' | 'taken',
  ) => {
    store.dispatch(setReport(listMsg, status))
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
    responder: string,
  ) => {
    store.dispatch(updateReportStatus(id, status, responder))
  },
}