import React, { useReducer, useMemo, useContext } from 'react';
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

export const useAppContext = (): ContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('No context');
  }
  return context;
};

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
