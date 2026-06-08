import { useCallback, useReducer } from 'react';
import { lookupWord, DictionaryError } from '../api/dictionaryApi';

/**
 * Search state machine:
 *   idle -> loading -> success | error
 *   error -> loading (retry)
 *   success -> loading (new search)
 */
const initialState = {
  status: 'idle', // idle | loading | success | error
  data: null,
  error: null, // { kind, message, word }
  query: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, status: 'loading', query: action.query, error: null };
    case 'SEARCH_SUCCESS':
      return { ...state, status: 'success', data: action.data, query: action.query, error: null };
    case 'SEARCH_ERROR':
      return { ...state, status: 'error', data: null, error: action.error, query: action.query };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useDictionarySearch({ onSuccess } = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const search = useCallback(
    async (rawWord) => {
      const query = (rawWord ?? '').trim();
      dispatch({ type: 'SEARCH_START', query });
      try {
        const data = await lookupWord(query);
        dispatch({ type: 'SEARCH_SUCCESS', data, query });
        onSuccess?.(data);
        return data;
      } catch (err) {
        const error =
          err instanceof DictionaryError
            ? { kind: err.kind, message: err.message, word: err.word }
            : { kind: 'UNKNOWN', message: 'An unexpected error occurred.', word: query };
        dispatch({ type: 'SEARCH_ERROR', error, query });
        throw error;
      }
    },
    [onSuccess]
  );

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    search,
    reset,
  };
}
