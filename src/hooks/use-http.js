// Steps to create a custom hook
// 1. Create a function which name has the prefix 'use'
// 2. Take into account that each component that uses the custom hook receives a snapshot of it
// 3. And remember that every time the component re-renders, the custom hook snapshot is recreated
// 4. Implement (or move) the state management to the custom hook. Start with the reducer and the initialization of useReducer()
// 5. Create a function that performs the effect (fetch or in general send request in this case)
// 6. The function of 5. must be as flexible as possible, adjusting the received parameters
// 7. Add a new property to the state if needed, in this case is the data property which will contain some related-request data
// 8. But how do we transfer the data received in the hook to the component? returning it. We can do this also for the rest of the pieces of state
// 9. The same as 8. can be done to send the request. Remember, the request is not send in the custom hook, it is only configured
// 10. Check if any rendering optimization can be applied in the custom hook, in this case useCallback in sendRequest
import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifer) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra,
          });
        })
        .catch((error) => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: error.message,
          });
        });
    },
    []
  );

  console.log('reqIdentifer en hook', httpState.reqIdentifer);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifer: httpState.identifier,
    clear,
  };
};

export default useHttp;
