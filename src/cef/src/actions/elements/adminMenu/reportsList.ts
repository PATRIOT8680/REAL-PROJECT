import { IMsg } from "../../../views/AdminMenu/pages/Reports.tsx";

export const setReport = (id: number, listMsg: IMsg[], status: 'waiting' | 'taken', responder: string | null) => {
  return {
    type: 'SET_REPORT',
    payload: { id, listMsg, status, responder }
  };
};

export const updateReportStatus = (id: number, status: 'waiting' | 'taken', responder: string | null) => ({
  type: 'UPDATE_REPORT_STATUS',
  payload: { id, status, responder },
});

export const updaterReportResponder = (id: number, responder: string | null) => ({
  type: 'UPDATE_REPORT_RESPONDER',
  payload: { id, responder },
});

export const addMessageToReport = (id: number, listMsg: IMsg) => ({
  type: 'ADD_MSG_TO_REPORT',
  payload: { id, listMsg },
})

export const closeReport = (id: number) => ({
  type: 'CLOSE_REPORT',
  payload: id,
})

export const getReport = () => {
  return { type: 'GET_REPORT' };
}