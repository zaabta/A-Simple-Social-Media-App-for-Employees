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
import { INTERNAL_API, PAGE_PATH } from '@/constants';

function* loginSaga(action: PayloadAction<LoginPayload>): Generator<any, void, any> {
  try {
    const response = yield call(authService.login, action.payload);
    yield put(loginSuccess(response));
    
    yield call(fetch, INTERNAL_API.AUTH.SET_COOKIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: response.accessToken,
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          image: response.image,
          gender: response.gender,
        },
      }),
    });

    if (typeof window !== 'undefined') {
      window.location.href = PAGE_PATH.USERS;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    yield put(loginFailure(errorMessage));
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(authService.logout);
    yield put(logoutSuccess());

    if (typeof window !== 'undefined') {
      yield delay(500);
      window.location.href = PAGE_PATH.LOGIN;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    yield put(logoutFailure(errorMessage));
  }
}

export function* authSaga(): Generator<any, void, any> {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}