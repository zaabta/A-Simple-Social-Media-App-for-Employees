import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth/authSaga';
import { usersSaga } from './users/saga';

export function* rootSaga(): Generator<any, void, any> {
  yield all([fork(authSaga), fork(usersSaga)]);
}
