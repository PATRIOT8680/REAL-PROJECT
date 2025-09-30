import { Reports } from "../../../views/AdminMenu/pages/Reports.tsx";

export interface ReportsState {
  reports: Reports[]
}

const initialState: ReportsState = {
  reports: []
}

export const reportReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_REPORT':
      const maxId = state.reports.length > 0
          ? Math.max(...state.reports.map(report => report.id))
          : 0
      const newReport = {
        id: maxId + 1,
        listMsg: action.payload.listMsg,
        status: action.payload.status,
        responder: undefined
      }

      return {
        ...state,
        reports: [...state.reports, newReport]
      }
    case 'UPDATE_REPORT_STATUS':
      return {
        ...state,
        reports: state.reports.map(report => {
          if (report.id === action.payload.id) {
            return {
              ...report,
              status: action.payload.status,
              responder: action.payload.responder
            };
          }
          return report;
        })
      };
    case 'ADD_MSG_TO_REPORT':
      return {
        ...state,
        reports: state.reports.map(report => {
          if (report.id === action.payload.id) {
            return {
              ...report,
              listMsg: [...report.listMsg, action.payload.listMsg]
            }
          }
          return report
        })
      }
    case 'CLOSE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(report => report.id !== action.payload)
      };
    case 'GET_REPORT':
      return state;
    default:
      return state;
  }
};