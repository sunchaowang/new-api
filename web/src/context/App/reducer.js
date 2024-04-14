import { SET_GROUPS } from './actions';
export const reducer = (state, action) => {
  switch (action.type) {
    case SET_GROUPS:
      return {
        ...state,
        app: {
          ...state.app,
          groups: action.payload,
        },
      };
    default:
      return state;
  }
};

export const initialState = {
  app: {
    groups: undefined,
    options: undefined,
  },
};
