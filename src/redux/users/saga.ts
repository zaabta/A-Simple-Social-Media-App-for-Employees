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
  searchUsersSuccess,
  searchUsersFailure,
  sortUsersRequest,
  sortUsersSuccess,
  sortUsersFailure,
  filterUsersRequest,
  filterUsersSuccess,
  filterUsersFailure,
} from './slice';
import type {
  FetchUsersPayload,
  FetchUserByIdPayload,
  SearchUsersPayload,
  SortUsersPayload,
  FilterUsersPayload,
} from './types';
import type { RootState } from '../store';
import { SORT_ORDERS } from '@/constants';

function* fetchUsersSaga(action: PayloadAction<FetchUsersPayload>): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const { page, limit, searchQuery, sortByFirstNameOrder, sortByAgeOrder, filters } = state.users;
    
    // Use either the provided payload or the current state
    const skip = action.payload.skip !== undefined ? action.payload.skip : (page - 1) * limit;
    
    const payload: FetchUsersPayload = {
      skip,
      limit: action.payload.limit || limit,
      query: action.payload.query !== undefined ? action.payload.query : searchQuery,
      sortByFirstNameOrder: action.payload.sortByFirstNameOrder !== undefined ? action.payload.sortByFirstNameOrder : sortByFirstNameOrder,
      sortByAgeOrder: action.payload.sortByAgeOrder !== undefined ? action.payload.sortByAgeOrder : sortByAgeOrder,
      filters: action.payload.filters || filters,
    };

    const response = yield call(usersService.fetchUsers, payload);
    yield put(fetchUsersSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    yield put(fetchUsersFailure(errorMessage));
  }
}

function* fetchUserByIdSaga(action: PayloadAction<FetchUserByIdPayload>): Generator<any, void, any> {
  try {
    const response = yield call(usersService.fetchUserById, action.payload.id);
    yield put(fetchUserByIdSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    yield put(fetchUserByIdFailure(errorMessage));
  }
}

export function* usersSaga(): Generator<any, void, any> {
  yield takeLatest([
    fetchUsersRequest.type, 
    searchUsersRequest.type, 
    sortUsersRequest.type, 
    filterUsersRequest.type
  ], fetchUsersSaga);
  yield takeLatest(fetchUserByIdRequest.type, fetchUserByIdSaga);
}
