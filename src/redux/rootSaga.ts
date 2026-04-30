import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth/authSaga';
import { usersSaga } from './users/usersSaga';

export function* rootSaga() {
  yield all([fork(authSaga), fork(usersSaga)]);
}
