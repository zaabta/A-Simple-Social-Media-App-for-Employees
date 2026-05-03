'use client';

import React, { ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store';
import { authActions } from '@/redux/auth/actions';
import type { AuthUser } from '@/redux/auth/types';
import { AUTH_TOKEN, AUTH_USER } from '@/constants';

interface ReduxProviderProps {
  children: ReactNode;
}

// Component to handle auth rehydration
function AuthHydrator({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate auth state from session storage on app load
    const token = sessionStorage.getItem(AUTH_TOKEN);
    const userJson = sessionStorage.getItem(AUTH_USER);

    if (token && userJson) {
      try {
        const user: AuthUser = JSON.parse(userJson);
        // Dispatch rehydrate action to restore auth state
        dispatch(authActions.rehydrate({ token, user }));
      } catch (error) {
        console.error('Failed to rehydrate auth state:', error);
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
};
