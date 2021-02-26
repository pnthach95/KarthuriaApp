import React, { useReducer, useMemo } from 'react';
import reducer, { initState } from './reducer';
import type { ActionType, AppState } from '~/typings';

type ContextProps = {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
};

type Props = {
  children: React.ReactNode;
};

const AppContext = React.createContext({} as ContextProps);

export const AppProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initState);
  const userReducer = useMemo<ContextProps>(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return (
    <AppContext.Provider value={userReducer}>{children}</AppContext.Provider>
  );
};

export default AppContext;
