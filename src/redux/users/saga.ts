import { call, put, takeLatest, debounce, select } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { usersService } from './service';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  searchUsersRequest,
} from './slice';
import type {
  FetchUsersPayload,
  FetchUserByIdPayload,
} from './types';
import type { RootState } from '../store';


// 🔥 MAIN WORKER (handles EVERYTHING)
function* fetchUsersSaga(
  action: PayloadAction<FetchUsersPayload>
): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const {
      page,
      limit,
      searchQuery,
      sortByFirstNameOrder,
      sortByAgeOrder,
      filterType,
      filterValue,
    } = state.users;

    // ✅ merge payload with state (payload overrides state)
    const finalPayload: FetchUsersPayload = {
      skip:
        action.payload.skip !== undefined
          ? action.payload.skip
          : (page - 1) * limit,

      limit: action.payload.limit ?? limit,

      query:
        action.payload.query !== undefined
          ? action.payload.query
          : searchQuery,

      sortByFirstNameOrder:
        action.payload.sortByFirstNameOrder !== undefined
          ? action.payload.sortByFirstNameOrder
          : sortByFirstNameOrder,

      sortByAgeOrder:
        action.payload.sortByAgeOrder !== undefined
          ? action.payload.sortByAgeOrder
          : sortByAgeOrder,
    };

    const response = yield call(usersService.fetchUsers, finalPayload);

    yield put(fetchUsersSuccess(response));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch users';

    yield put(fetchUsersFailure(errorMessage));
  }
}


// 👤 USER DETAILS
function* fetchUserByIdSaga(
  action: PayloadAction<FetchUserByIdPayload>
): Generator<any, void, any> {
  try {
    const response = yield call(
      usersService.fetchUserById,
      action.payload.id
    );

    yield put(fetchUserByIdSuccess(response));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch user';

    yield put(fetchUserByIdFailure(errorMessage));
  }
}


// 👀 WATCHERS
export function* usersSaga(): Generator {
  // ⚡ Normal fetch (pagination, filter, sort)
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);

  // 🔍 Debounced search
  yield debounce(500, searchUsersRequest.type, fetchUsersSaga);

  // 👤 User details
  yield takeLatest(fetchUserByIdRequest.type, fetchUserByIdSaga);
}