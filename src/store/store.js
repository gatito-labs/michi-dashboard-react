import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
  useEffect,
  useMemo,
} from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import {
  CHECK_SERVER,
  CHECK_SERVER_ERROR,
  CHECK_SERVER_SUCCESS,
  CREATE_HUB_USER,
  CREATE_HUB_USER_ERROR,
  CREATE_HUB_USER_SUCCESS,
  START_SERVER,
  START_SERVER_ERROR,
  START_SERVER_SUCCESS,
  START_SERVER_PROGRESS,
  STOP_SERVER,
  STOP_SERVER_ERROR,
  STOP_SERVER_SUCCESS,
  GET_AVAILABLE_ENVIROMENTS,
  CLEAR_ERRORS,
} from "./reducer";

import { reducer, initialState } from "./reducer";

const Store = createContext();
Store.displayName = "HubServerStore";

export const useHubServer = () => useContext(Store);

export const HubServerProvider = ({ children }) => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [token, setToken] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then((res) => {
        let _token = res.__raw;
        setToken(_token);

        if (res[`${process.env.REACT_APP_TOKEN_NAMESPACE}/enviroments`]) {
          dispatch({
            type: GET_AVAILABLE_ENVIROMENTS,
            payload:
              res[`${process.env.REACT_APP_TOKEN_NAMESPACE}/enviroments`],
          });
        }
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const ctrl = useMemo(() => new AbortController(), []);

  const checkServerStartingProgress = useCallback(() => {
    fetchEventSource(
      `${process.env.REACT_APP_API_DOMAIN}${user.email}/server/progress`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: ctrl.signal,
        onmessage(msg) {
          var progressData = msg.data;
          // console.log(msg.data);
          if (progressData && progressData !== "") {
            progressData = JSON.parse(progressData);

            if (progressData.progress) {
              dispatch({
                type: START_SERVER_PROGRESS,
                payload: progressData.progress,
              });
            }

            if (progressData.ready) {
              dispatch({ type: START_SERVER_SUCCESS });
              ctrl.abort();
            }
          }
        },
      }
    );
  }, [ctrl, token, user?.email]);

  const checkServerStatus = useCallback(async () => {
    try {
      if (user && token) {
        dispatch({ type: CHECK_SERVER });
        const url = `${process.env.REACT_APP_API_DOMAIN}${user.email}`;

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const json = await response.json();

          if (json.pending === "spawn") {
            checkServerStartingProgress();
          }
          dispatch({
            type: CHECK_SERVER_SUCCESS,
            payload: {
              serverRunning: json.server ? json.servers[""].ready : false,
              startingServer: json.pending === "spawn",
              runningEnviroment:
                (json.server && json.servers[""]) || json.pending === "spawn"
                  ? json.servers[""].user_options.profile
                  : null,
            },
          });
        } else if (response.status === 404) {
          console.log("creando hub user");
          dispatch({
            type: CREATE_HUB_USER,
          });

          const createHubUserResponse = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (createHubUserResponse.status === 201) {
            dispatch({ type: CREATE_HUB_USER_SUCCESS });
          } else {
            dispatch({
              type: CREATE_HUB_USER_ERROR,
              payload: createHubUserResponse,
            });
            console.log(
              "Error al crear usuario en el hub, recargar para probar de nuevo."
            );
          }
        } else {
          dispatch({
            type: CHECK_SERVER_ERROR,
            payload:
              response.status === 401
                ? "Usuario no autorizado."
                : "Error no documentado.",
          });
        }
      }
    } catch (error) {
      dispatch({
        type: CHECK_SERVER_ERROR,
        payload: error,
      });
    }
  }, [user, token, checkServerStartingProgress]);

  const startServer = useCallback(
    async (env) => {
      dispatch({ type: START_SERVER, payload: env.name });

      fetch(`${process.env.REACT_APP_API_DOMAIN}${user.email}/server`, {
        // content-type header should not be specified!
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          profile: env.name,
        }),
      })
        .then((res) => {
          if (res.status === 200 || res.status === 202) {
            checkServerStartingProgress();
          } else {
            dispatch({
              type: START_SERVER_ERROR,
              payload:
                res.status === 401
                  ? "Error! No estás autorizado para esta operación!"
                  : res.status === 400
                  ? "Ya hay un servidor corriendo!"
                  : `Error no documentado (${res.status})`,
            });

            checkServerStatus();
          }
        })
        .catch((error) => {
          dispatch({ type: START_SERVER_ERROR, payload: error });
        });
    },
    [user, token, checkServerStartingProgress, checkServerStatus]
  );

  const stopServer = useCallback(async () => {
    dispatch({ type: STOP_SERVER });
    fetch(`${process.env.REACT_APP_API_DOMAIN}${user.email}/server`, {
      // content-type header should not be specified!
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        dispatch({ type: STOP_SERVER_SUCCESS });
        ctrl.abort();
      })
      .catch((error) => {
        dispatch({ type: STOP_SERVER_ERROR });
        checkServerStatus();
        console.log(error);
      });
  }, [user, ctrl, token, checkServerStatus]);

  const clearErrors = useCallback(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);

  return (
    <Store.Provider
      value={{
        ...state,
        checkServerStatus,
        startServer,
        stopServer,
        clearErrors,
      }}
    >
      {children}
    </Store.Provider>
  );
};
