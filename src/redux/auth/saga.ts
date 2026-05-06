import { call, put, takeLatest, delay } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from './service';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from './slice';
import type { LoginPayload } from './types';
import { AUTH_TOKEN, AUTH_USER, ERROR_MESSAGES, PAGE_PATH } from '@/constants';
import { setCookieDirect } from '@/utils';

function verifyCookie(name: string): boolean {
  return document.cookie.split(';').some(c => c.trim().startsWith(`${name}=`));
}

function* loginSaga(action: PayloadAction<LoginPayload>): Generator<any, void, any> {
  try {
    const response = yield call(authService.login, action.payload);

    const user = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      image: response.image,
      gender: response.gender,
    };

    // Set cookie directly via document.cookie
    // secure flag is based on protocol — works on http (local) and https (Vercel)
    setCookieDirect(response.accessToken, user);

    // Verify it was actually stored
    const cookieSet: boolean = verifyCookie(AUTH_TOKEN);
    if (!cookieSet) {
      throw new Error('Cookie was not stored by browser');
    }

    yield put(loginSuccess(response));

    // Use replace instead of href to avoid back-button issues
    window.location.replace(PAGE_PATH.USERS);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED;
    yield put(loginFailure(errorMessage));
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(authService.logout);
    yield put(logoutSuccess());

    if (typeof window !== 'undefined') {
      // Clear cookies client-side too
      document.cookie = `${AUTH_TOKEN}=;path=/;max-age=-1`;
      document.cookie = `${AUTH_USER}=;path=/;max-age=-1`;
      yield delay(100);
      window.location.replace(PAGE_PATH.LOGIN);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.LOGOUT_FAILED;
    yield put(logoutFailure(errorMessage));
  }
}

export function* authSaga(): Generator<any, void, any> {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}