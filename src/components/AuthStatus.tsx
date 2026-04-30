'use client';

import React from 'react';
import { useAppDispatch, useAppSelector, selectAuthUser, selectIsAuthenticated } from '@/redux/hooks';
import { authActions } from '@/redux/auth/authActions';

/**
 * Example: Auth Status Component
 * Demonstrates:
 * - Using typed selectors
 * - Showing user info
 * - Dispatching logout action
 */
export function AuthStatus() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated || !user) {
    return <div className="text-gray-600">Not authenticated</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="font-semibold">{user.firstName} {user.lastName}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
      <button
        onClick={() => dispatch(authActions.logout())}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
