import { Reports } from "../../../views/AdminMenu/pages/Reports.tsx";

export interface ReportsState {
  reports: Reports[]
}

const initialState: ReportsState = {
  reports: [
    {
      id: 1,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' },
        { nickName: 'Patriot Adminov', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 23:02:05', role: 'admin' },
        { nickName: 'Patriot Adminov', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 23:02:05', role: 'admin' },
        { nickName: 'Patriot Adminov', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 23:02:05', role: 'admin' },
        { nickName: 'Patriot Adminov', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 23:02:05', role: 'admin' },
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:01:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
    {
      id: 2,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
    {
      id: 3,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
    {
      id: 4,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
    {
      id: 5,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
    {
      id: 6,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
    {
      id: 7,
      listMsg: [
        { nickName: 'William Blade', text: 'Здравствуйте, дорогая администрация. Я недавно оставил заявку на амнистию на форуме, но её никто не хочет рассматривать. Я очень надеюсь на вашу компетентность и понимание!', dateTime: '13.03.2025 - 22:02:05', role: 'player' }
      ],
      status: 'waiting',
      responder: null
    },
  ]
}

export const reportReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_REPORT':
      return {
        ...state,
        reports: [...state.reports, action.payload]
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
          } else if (report.responder === action.payload.responder) {
            return {
              ...report,
              status: 'waiting',
              responder: null
            };
          }
          return report;
        })
      };
    case 'UPDATE_REPORT_RESPONDER':
      return {
        ...state,
        reports: state.reports.map(report =>
            report.id === action.payload.id ? { ...report, responder: action.payload.responder } : report
        )
      }
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