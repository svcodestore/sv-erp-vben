import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '/@/enums/cacheEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getAccessToken() {
  return getAuthCache(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return getAuthCache(REFRESH_TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

export function goSsoLogin() {
  const origin = window.location.origin;
  const authPath = import.meta.env.VITE_SSO_API_URL;
  const authSearchParams = new URLSearchParams();
  authSearchParams.append('response_type', 'code');
  authSearchParams.append('client_id', '60f9bd80d01913d3c74e');
  authSearchParams.append('redirect_uri', new URL('/callback', origin).toString());
  authSearchParams.append('scope', 'read');
  const authHref = authPath + authSearchParams.toString();
  window.location.href = authHref;
}
