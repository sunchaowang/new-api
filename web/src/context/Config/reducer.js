export const reducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        config: action.payload,
      };
    case 'unset':
      return {
        ...state,
        config: undefined,
      };
    default:
      return state;
  }
};

export const initialState = {
  config: {
    // 是否开启菜单折叠
    isCollapse: false,
    theme: 'light',
  },
};
