export const CREATE_PAYMENT_REQUEST = "PAYMENT/CREATE_PAYMENT_REQUEST/START";
export const CREATE_PAYMENT_REQUEST_ERROR =
  "PAYMENT/CREATE_PAYMENT_REQUEST/ERROR";
export const CREATE_PAYMENT_REQUEST_SUCCESS =
  "PAYMENT/CREATE_PAYMENT_REQUEST/SUCCESS";
export const CHECK_PAYMENT_STATUS = "PAYMENT/CHECK_PAYMENT_STATUS/START";
export const CHECK_PAYMENT_STATUS_ERROR = "PAYMENT/CHECK_PAYMENT_STATUS/ERROR";
export const CHECK_PAYMENT_STATUS_SUCCESS =
  "PAYMENT/CHECK_PAYMENT_STATUS/SUCCESS";
export const SET_COURSE_TO_BUY = "PAYMENT/SET_COURSE_TO_BUY/SUCCESS";
export const CLEAR_ERRORS = "PAYMENT/CLEAR_ERRORS/SUCCESS";
export const CLEAR_PAYMENT_INFO = "PAYMENT/CLEAR_PAYMENT_INFO/SUCCESS";

export const REDEEM_COURSE = "PAYMENT/REDEEM_COURSE/START";
export const REDEEM_COURSE_ERROR = "PAYMENT/REDEEM_COURSE/ERROR";
export const REDEEM_COURSE_SUCCESS = "PAYMENT/REDEEM_COURSE/SUCCESS";

export const NO_PAYMENT = -2;
export const LOADING_PAYMENT_STATUS = -1;
export const PAYMENT_PENDING = 1;
export const PAYMENT_COMPLETED = 2;
export const PAYMENT_REJECTED = 3;
export const PAYMENT_ABORTED = 4;

export const initialState = {
  // loadingStatus: false,
  creatingPayment: false,
  availableCoursesToBuy: [],
  paymentCreated: false,
  paymentStatus: NO_PAYMENT,
  course: null,

  redeemCourseCode: "",
  redeemCourseLoading: false,
  redeemCourseSuccess: false,

  paymentInfo: {
    paymentRequestToken: "",
    paymentRequestURL: "",
    paymentCommerceOrder: "",
    paymentEmail: "",
  },
  error: "",
};

export const reducer = (state, action) => {
  console.debug(action.type);
  console.debug({ state });

  switch (action.type) {
    case CREATE_PAYMENT_REQUEST:
      return { ...state, creatingPayment: true, paymentCreated: false };

    case CREATE_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        creatingPayment: false,
        paymentCreated: true,
        paymentInfo: action.payload,
      };

    case CREATE_PAYMENT_REQUEST_ERROR:
      return {
        ...state,
        creatingPayment: false,
        paymentCreated: false,
        error: action.payload,
      };

    case CHECK_PAYMENT_STATUS:
      return { ...state, paymentStatus: LOADING_PAYMENT_STATUS };

    case CHECK_PAYMENT_STATUS_SUCCESS:
      return {
        ...state,
        loadingStatus: false,
        paymentStatus: action.payload.paymentStatus,
        paymentInfo: { ...state.paymentInfo, ...action.payload.paymentInfo },
      };

    case CHECK_PAYMENT_STATUS_ERROR:
      return { ...state, loadingStatus: false, error: action.payload };

    case SET_COURSE_TO_BUY:
      return { ...state, course: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: "" };

    case CLEAR_PAYMENT_INFO:
      return {
        ...initialState,
        availableCoursesToBuy: state.availableCoursesToBuy,
      };

    case REDEEM_COURSE:
      return {
        ...state,
        redeemCourseCode: action.payload,
        redeemCourseLoading: true,
        redeemCourseSuccess: false,
      };

    case REDEEM_COURSE_ERROR:
      return {
        ...state,
        redeemCourseLoading: false,
        redeemCourseSuccess: false,
        error: action.payload,
      };

    case REDEEM_COURSE_SUCCESS:
      return {
        ...state,
        redeemCourseLoading: false,
        redeemCourseSuccess: true,
      };

    default:
      return state;
  }
};
