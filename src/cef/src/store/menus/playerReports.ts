import { store } from "../store";
import { showPlayerReports, hidePlayerReports } from "../../actions/menus/playerReports.ts";

export const playerReportsStore = {
  showPlayerReports: () => store.dispatch(showPlayerReports()),
  hidePlayerReports: () => store.dispatch(hidePlayerReports()),
}