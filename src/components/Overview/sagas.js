import { fork, put, call, takeLatest, select } from 'redux-saga/effects';

import { realmSelector } from '../Login/selectors';
import { SUCCESS_ENTER_REALM, loginRealm } from '../Login/actions';
import { fetchSessionsByRealmId, fetchPlayersByRealmId } from './api';
import {
  fetchSessionsSuccess,
  fetchPlayersSuccess,
  FETCH_REALM_INFO,
} from './actions';

export function* fetchSessions(realmId) {
  const { data } = yield call(fetchSessionsByRealmId, realmId);
  const { sessionsByRealmId: sessions } = data;

  yield put(fetchSessionsSuccess(sessions));
}

export function* fetchPlayers(realmId) {
  // TODO fetchPlayersByRealmId IS NOT DEFINED YET
  const { data } = yield call(fetchPlayersByRealmId, realmId);
  const { playersByRealmId: players } = data;

  yield put(fetchPlayersSuccess(players));
}

export function* fetchRealmInfo() {
  const { id } = yield select(realmSelector);

  yield [
    // TODO allow fetching of these, careful when they navigate
    // directly to session page as realm won't be set in state
    fork(fetchSessions, `${id}`),
    // fork(fetchPlayers, id),
  ];
}

export function* fetchRealmThenInfo() {
  const realmName = document.location.pathname.replace('/overview/', '');

  yield put(loginRealm(realmName));
}

export default function* watchOverview() {
  yield [
    takeLatest(SUCCESS_ENTER_REALM, fetchRealmInfo),
    takeLatest(FETCH_REALM_INFO, fetchRealmThenInfo),
  ];
};
