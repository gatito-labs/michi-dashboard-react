// Actions Types
export const CHECK_SERVER = "SERVER/CHECK_STATUS/START";
export const CHECK_SERVER_ERROR = "SERVER/CHECK_STATUS/ERROR";
export const CHECK_SERVER_SUCCESS = "SERVER/CHECK_STATUS/SUCCESS";
export const CREATE_HUB_USER = "SERVER/CREATE_HUB_USER/START";
export const CREATE_HUB_USER_ERROR = "SERVER/CREATE_HUB_USER/ERROR";
export const CREATE_HUB_USER_SUCCESS = "SERVER/CREATE_HUB_USER/SUCCESS";

export const START_SERVER = "SERVER/START_SERVER/START";
export const START_SERVER_ERROR = "SERVER/START_SERVER/ERROR";
export const START_SERVER_SUCCESS = "SERVER/START_SERVER/SUCCESS";
export const START_SERVER_PROGRESS = "SERVER/START_SERVER/PROGRESS";
export const STOP_SERVER = "SERVER/STOP_SERVER/START";
export const STOP_SERVER_ERROR = "SERVER/STOP_SERVER/ERROR";
export const STOP_SERVER_SUCCESS = "SERVER/STOP_SERVER/SUCCESS";

export const GET_AVAILABLE_ENVIROMENTS = "GET_AVAILABLE_ENVIROMENTS";

export const initialState = {
  loadingStatus: false,
  serverRunning: false,
  startingServer: false,
  startingServerProgress: 0,
  stopingServer: false,
  creatingHubUser: false,
  runningEnviroment: null,
  serverError: null,
};

export const reducer = (state, action) => {
  console.debug(action.type);
  console.debug(state);

  switch (action.type) {
    case CHECK_SERVER:
      return { ...state, loadingStatus: true };

    case CHECK_SERVER_SUCCESS:
      return { ...state, loadingStatus: false, ...action.payload };

    case CHECK_SERVER_ERROR:
      return {
        ...state,
        loadingStatus: false,
        serverError: String(action.payload),
      };

    case CREATE_HUB_USER:
      return { ...state, loadingStatus: true, creatingHubUser: true };

    case CREATE_HUB_USER_SUCCESS:
      return { ...state, loadingStatus: false, creatingHubUser: false };

    case CREATE_HUB_USER_ERROR:
      return {
        ...state,
        loadingStatus: false,
        creatingHubUser: false,
        serverError: String(action.payload),
      };

    case START_SERVER:
      return {
        ...state,
        startingServer: true,
        runningEnviroment: action.payload,
      };

    case START_SERVER_SUCCESS:
      return {
        ...state,
        startingServer: false,
        serverRunning: true,
        startingServerProgress: 0,
      };

    case START_SERVER_ERROR:
      return {
        ...state,
        startingServer: false,
        serverError: String(action.payload),
        startingServerProgress: 0,
      };

    case START_SERVER_PROGRESS:
      return { ...state, startingServerProgress: action.payload };

    case STOP_SERVER:
      return { ...state, stopingServer: true };

    case STOP_SERVER_SUCCESS:
      return {
        ...state,
        stopingServer: false,
        serverRunning: false,
        runningEnviroment: null,
      };

    case STOP_SERVER_ERROR:
      return {
        ...state,
        stopingServer: false,
        serverError: String(action.payload),
      };

    default:
      return { ...state };
  }
};
