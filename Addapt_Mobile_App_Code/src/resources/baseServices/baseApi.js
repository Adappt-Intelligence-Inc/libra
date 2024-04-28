import {callApi} from '../base/apiDriver';

export const callApiGet = ({url, params = {}, customHeaders = {}}) =>
  callApi(
    url,
    {
      method: 'GET',
      params,
    },
    customHeaders,
  );

export const callApiPost = ({url, data, customHeaders}) =>
  callApi(
    url,
    {
      method: 'POST',
      data: data,
    },
    customHeaders,
  );

export const callApiPut = ({url, data = {}, customHeaders = {}}) =>
  callApi(
    url,
    {
      method: 'PUT',
      data: data,
    },
    customHeaders,
  );

export const callApiDelete = ({url, customHeaders}) =>
  callApi(url, {method: 'DELETE'}, customHeaders);
