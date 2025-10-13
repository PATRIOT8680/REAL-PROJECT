import { Reports } from "../../../views/AdminMenu/pages/Reports.tsx";

export interface ReportsState {
  reports: Reports[]
}

const initialState: ReportsState = {
  reports: [
    // {
    //   id: 1450,
    //   listMsg: [
    //     {
    //       nickName: "Иван_Иванов",
    //       text: "Игрок использует читы, стреляет через стены",
    //       dateTime: "15.01.2024 - 14:30:25",
    //       role: "player"
    //     },
    //     {
    //       nickName: "Admin_Alex",
    //       text: "Проверил, нарушений не обнаружено",
    //       dateTime: "15.01.2024 - 14:35:10",
    //       role: "admin"
    //     }
    //   ],
    //   status: "reviewed",
    //   responder: "Admin_Alex"
    // },
    // {
    //   id: 1449,
    //   listMsg: [
    //     {
    //       nickName: "Петр_Сергеев",
    //       text: "Пропали предметы из инвентаря после перезахода",
    //       dateTime: "15.01.2024 - 13:20:15",
    //       role: "player"
    //     },
    //     {
    //       nickName: "Admin_Maria",
    //       text: "Предметы восстановлены, проверьте инвентарь",
    //       dateTime: "15.01.2024 - 13:25:40",
    //       role: "admin"
    //     }
    //   ],
    //   status: "taken",
    //   responder: "Admin_Maria"
    // },
    // {
    //   id: 1448,
    //   listMsg: [
    //     {
    //       nickName: "Анна_Коваль",
    //       text: "Игрок оскорбляет в голосовом чате",
    //       dateTime: "15.01.2024 - 12:15:30",
    //       role: "player"
    //     }
    //   ],
    //   status: "waiting",
    //   responder: undefined
    // },
    // {
    //   id: 1447,
    //   listMsg: [
    //     {
    //       nickName: "Сергей_Петров",
    //       text: "Баг с текстурой на карте",
    //       dateTime: "15.01.2024 - 11:45:20",
    //       role: "player"
    //     },
    //     {
    //       nickName: "Admin_Alex",
    //       text: "Баг известен, исправим в следующем обновлении",
    //       dateTime: "15.01.2024 - 11:50:05",
    //       role: "admin"
    //     }
    //   ],
    //   status: "reviewed",
    //   responder: "Admin_Alex"
    // },
    // {
    //   id: 1446,
    //   listMsg: [
    //     {
    //       nickName: "Дмитрий_Сидоров",
    //       text: "Не работает телепорт в локации",
    //       dateTime: "15.01.2024 - 10:30:15",
    //       role: "player"
    //     }
    //   ],
    //   status: "waiting",
    //   responder: undefined
    // },
    // {
    //   id: 1445,
    //   listMsg: [
    //     {
    //       nickName: "Елена_Васнецова",
    //       text: "Игрок мешает прохождению квеста",
    //       dateTime: "15.01.2024 - 09:25:40",
    //       role: "player"
    //     },
    //     {
    //       nickName: "Admin_Max",
    //       text: "Предупреждение выдано, следите за поведением",
    //       dateTime: "15.01.2024 - 09:30:20",
    //       role: "admin"
    //     }
    //   ],
    //   status: "taken",
    //   responder: "Admin_Max"
    // },
    // {
    //   id: 1444,
    //   listMsg: [
    //     {
    //       nickName: "Михаил_Орлов",
    //       text: "Проблема с подключением к серверу",
    //       dateTime: "15.01.2024 - 08:20:35",
    //       role: "player"
    //     },
    //     {
    //       nickName: "Admin_Alex",
    //       text: "Проверьте ваше интернет-соединение",
    //       dateTime: "15.01.2024 - 08:25:10",
    //       role: "admin"
    //     },
    //     {
    //       nickName: "Михаил_Орлов",
    //       text: "Соединение стабильное, проблема осталась",
    //       dateTime: "15.01.2024 - 08:30:45",
    //       role: "player"
    //     }
    //   ],
    //   status: "reviewed",
    //   responder: "Admin_Alex"
    // },
    // {
    //   id: 1443,
    //   listMsg: [
    //     {
    //       nickName: "Ольга_Новикова",
    //       text: "Предлагаю добавить новую функцию в игру",
    //       dateTime: "15.01.2024 - 07:15:25",
    //       role: "player"
    //     }
    //   ],
    //   status: "waiting",
    //   responder: undefined
    // },
    // {
    //   id: 1442,
    //   listMsg: [
    //     {
    //       nickName: "Алексей_Козлов",
    //       text: "Нашел баг с физикой объектов",
    //       dateTime: "15.01.2024 - 06:10:30",
    //       role: "player"
    //     },
    //     {
    //       nickName: "Admin_Maria",
    //       text: "Спасибо за сообщение, передали разработчикам",
    //       dateTime: "15.01.2024 - 06:15:15",
    //       role: "admin"
    //     }
    //   ],
    //   status: "reviewed",
    //   responder: "Admin_Maria"
    // },
    // {
    //   id: 1441,
    //   listMsg: [
    //     {
    //       nickName: "Наталья_Соколова",
    //       text: "Игрок использует нецензурную лексику",
    //       dateTime: "15.01.2024 - 05:05:20",
    //       role: "player"
    //     }
    //   ],
    //   status: "waiting",
    //   responder: undefined
    // }
  ]
}

export const reportReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_REPORT':
      const newReport = {
        id: action.payload.id,
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