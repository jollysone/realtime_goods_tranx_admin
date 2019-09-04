import fetch from 'dva/fetch';
import { message } from 'antd';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {};
  const newOptions = { ...defaultOptions, ...options };
  const token = localStorage.getItem('token');
  if (token) {
    newOptions.headers = {
      ...newOptions.headers,
      'Auth-Token': token,
    };
  }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'PATCH' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions).then(response => {
    const json = response.json();
    json.then(res => {
      if (!res.success) {
        message.warning(res.message);
        if (res.error_code === 1004 || res.error_code === 1005) {
          localStorage.removeItem('token');
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
        }
      }
    });
    return json;
  });
}
