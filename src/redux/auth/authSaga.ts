import { call, put, takeLatest, delay } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from './authService';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from './authSlice';
import type { LoginPayload } from './authTypes';

function* loginSaga(action: PayloadAction<LoginPayload>): Generator<any, void, any> {
  try {
    const response = yield call(authService.login, action.payload);
    yield put(loginSuccess(response));

    // Redirect to users page
    if (typeof window !== 'undefined') {
      window.location.href = '/users';
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

    // Redirect to login page
    if (typeof window !== 'undefined') {
      yield delay(500);
      window.location.href = '/login';
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
