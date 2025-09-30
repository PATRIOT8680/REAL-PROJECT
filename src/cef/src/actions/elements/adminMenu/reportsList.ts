import { IMsg } from "../../../views/AdminMenu/pages/Reports.tsx";

export const setReport = (listMsg: IMsg[], status: 'waiting' | 'taken') => {
  return {
    type: 'SET_REPORT',
    payload: { listMsg, status }
  };
};

export const updateReportStatus = (id: number, status: 'waiting' | 'taken', responder: string) => ({
  type: 'UPDATE_REPORT_STATUS',
  payload: { id, status, responder },
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