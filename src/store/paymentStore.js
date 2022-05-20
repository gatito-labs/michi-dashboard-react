import React, {
  useContext,
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth0 } from "@auth0/auth0-react";
import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_REQUEST_ERROR,
  CREATE_PAYMENT_REQUEST_SUCCESS,
  CHECK_PAYMENT_STATUS,
  CHECK_PAYMENT_STATUS_ERROR,
  CHECK_PAYMENT_STATUS_SUCCESS,
  SET_COURSE_TO_BUY,
  CLEAR_ERRORS,
  // CLEAR_PAYMENT_INFO,
  LOADING_PAYMENT_STATUS,
  // NO_PAYMENT,
  // PAYMENT_PENDING,
  PAYMENT_ABORTED,
  PAYMENT_COMPLETED,
  PAYMENT_REJECTED,
  REDEEM_COURSE,
  REDEEM_COURSE_ERROR,
  REDEEM_COURSE_SUCCESS,
} from "./paymentReducer";

import { reducer, initialState } from "./paymentReducer";

const Store = createContext();
Store.displayName = "PaymentServerStore";
export const usePayment = () => useContext(Store);

export const PaymentProvider = ({ children }) => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then((res) => {
        setToken(res.__raw);
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const createPayment = useCallback(() => {
    dispatch({ type: CREATE_PAYMENT_REQUEST });

    fetch(`${process.env.REACT_APP_PAYMENT_API}/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course: state.course.name,
        user: { email: user.email, user_id: user.sub },
        redirect: window.location.host,
      }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const json = await res.json();
          console.log(json);
          dispatch({
            type: CREATE_PAYMENT_REQUEST_SUCCESS,
            payload: {
              paymentRequestToken: json.token,
              paymentRequestURL: json.url,
              paymentCommerceOrder: json.flowOrder,
              paymentEmail: json.payerEmail,
            },
          });
        } else {
          dispatch({
            type: CREATE_PAYMENT_REQUEST_ERROR,
            payload:
              "Error para crear la solicitud de pago, porfavor intenta nuevamente",
          });
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: CREATE_PAYMENT_REQUEST_ERROR,
          payload: "Error de conexión con el servidor de pagos",
        });
      });
  }, [token, user, state?.course?.name]);

  const checkPaymentStatus = useCallback(
    (paymentToken = null) => {
      if (
        state.paymentStatus === PAYMENT_ABORTED ||
        state.paymentStatus === PAYMENT_COMPLETED ||
        state.paymentStatus === PAYMENT_REJECTED ||
        state.paymentStatus === LOADING_PAYMENT_STATUS
      ) {
        return;
      }

      if (
        paymentToken === null &&
        state.paymentInfo.paymentRequestToken === ""
      ) {
        console.error("No token provider to check payment");
        return;
      }

      dispatch({ type: CHECK_PAYMENT_STATUS });

      fetch(
        `${process.env.REACT_APP_PAYMENT_API}/status?token=${
          paymentToken ? paymentToken : state.paymentInfo.paymentRequestToken
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          if (res.status === 200) {
            const json = await res.json();

            console.log(json);
            dispatch({
              type: CHECK_PAYMENT_STATUS_SUCCESS,
              payload: {
                paymentStatus: json.paymentStatus,
                paymentInfo: { paymentCommerceOrder: json.flowOrder },
              },
            });
          } else {
            dispatch({
              type: CHECK_PAYMENT_STATUS_ERROR,
              payload: (
                <>
                  Error para obtener la información de pago, recarga la página
                  porfavor.
                  <br /> Si aún no puedes acceder al curso que compraste,
                  porfavor contáctanos a soporte@gatitolabs.cl.
                </>
              ),
            });
            console.error(res);
          }
        })
        .catch((err) => {
          console.error(err);
          dispatch({
            type: CREATE_PAYMENT_REQUEST_ERROR,
            payload: (
              <>
                Error para obtener la información de pago, recarga la página.{" "}
                <br /> Si aún no puedes acceder al curso que compraste, porfavor
                contáctanos a soporte@gatitolabs.cl o en Instagram @gatitolabs.
              </>
            ),
          });
        });
    },
    [state.paymentInfo, state.paymentStatus, token]
  );

  const clearErrors = useCallback(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);

  const clearPaymentInfo = useCallback(() => {}, []);

  const redeemCourse = useCallback(
    (code) => {
      dispatch({ type: REDEEM_COURSE, payload: code });

      fetch(`${process.env.REACT_APP_PAYMENT_API}/redeem`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          user: { email: user.email, user_id: user.sub },
        }),
      })
        .then(async (res) => {
          if (res.status === 200) {
            const json = await res.json();

            if (json.status === "reedemed") {
              dispatch({ type: REDEEM_COURSE_SUCCESS });
            } else {
              dispatch({
                type: REDEEM_COURSE_ERROR,
                payload:
                  json.status === "rejected"
                    ? json.msg
                    : "Error de conexión, no podemos canjear el código de tu curso en este momento!",
              });
            }
          } else {
            dispatch({
              type: REDEEM_COURSE_ERROR,
              payload:
                "Error de conexión, no podemos canjear el código de tu curso en este momento!",
            });
          }
        })
        .catch(() => {
          dispatch({
            type: REDEEM_COURSE_ERROR,
            payload:
              "Error de conexión, no podemos canjear el código de tu curso en este momento!",
          });
        });
    },
    [token, user?.email, user?.sub]
  );

  const setCourse = useCallback((course) => {
    dispatch({ type: SET_COURSE_TO_BUY, payload: course });
  }, []);

  return (
    <Store.Provider
      value={{
        ...state,
        createPayment,
        checkPaymentStatus,
        clearErrors,
        clearPaymentInfo,
        setCourse,
        redeemCourse,
      }}
    >
      {children}
    </Store.Provider>
  );
};
