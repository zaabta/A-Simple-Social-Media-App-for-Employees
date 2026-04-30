import { call, put, takeLatest, debounce, select } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { usersService } from './usersService';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  searchUsersRequest,
  searchUsersSuccess,
  searchUsersFailure,
  sortUsersRequest,
  sortUsersSuccess,
  sortUsersFailure,
  filterUsersRequest,
  filterUsersSuccess,
  filterUsersFailure,
} from './usersSlice';
import type {
  FetchUsersPayload,
  FetchUserByIdPayload,
  SearchUsersPayload,
  SortUsersPayload,
  FilterUsersPayload,
} from './usersTypes';
import type { RootState } from '../store';
import { calculateSkip } from '@/utils/helpers';

function* fetchUsersSaga(action: PayloadAction<FetchUsersPayload>) {
  try {
    const response = yield call(usersService.fetchUsers, action.payload);
    yield put(fetchUsersSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    yield put(fetchUsersFailure(errorMessage));
  }
}

function* fetchUserByIdSaga(action: PayloadAction<FetchUserByIdPayload>) {
  try {
    const response = yield call(usersService.fetchUserById, action.payload.id);
    yield put(fetchUserByIdSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    yield put(fetchUserByIdFailure(errorMessage));
  }
}

function* searchUsersSaga(action: PayloadAction<SearchUsersPayload>) {
  try {
    if (!action.payload.query.trim()) {
      yield put(searchUsersFailure('Search query cannot be empty'));
      return;
    }
    const response = yield call(usersService.searchUsers, action.payload);
    yield put(searchUsersSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
    yield put(searchUsersFailure(errorMessage));
  }
}

function* sortUsersSaga(action: PayloadAction<SortUsersPayload>) {
  try {
    const state: RootState = yield select();
    const { sortField, sortOrder, limit } = state.users;
    const skip = 0;

    // If sortOrder is null, do a regular fetch without sorting
    if (sortOrder === null) {
      const response = yield call(usersService.fetchUsers, { skip, limit });
      yield put(sortUsersSuccess(response));
    } else {
      // Call sort API with the new field and order
      const payload = {
        field: sortField || action.payload.field,
        skip,
        limit,
      };
      const response = yield call(usersService.sortUsers, payload);
      yield put(sortUsersSuccess(response));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sort users';
    yield put(sortUsersFailure(errorMessage));
  }
}

function* filterUsersSaga(action: PayloadAction<FilterUsersPayload>) {
  try {
    const state: RootState = yield select();
    const { limit } = state.users;
    const skip = 0;

    const payload = {
      ...action.payload,
      skip,
      limit,
    };
    const response = yield call(usersService.filterUsers, payload);
    yield put(filterUsersSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to filter users';
    yield put(filterUsersFailure(errorMessage));
  }
}

export function* usersSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchUserByIdRequest.type, fetchUserByIdSaga);
  yield debounce(500, searchUsersRequest.type, searchUsersSaga);
  yield takeLatest(sortUsersRequest.type, sortUsersSaga);
  yield takeLatest(filterUsersRequest.type, filterUsersSaga);
}
