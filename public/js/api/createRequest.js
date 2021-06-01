/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( { url, headers = {}, data = {}, responseType, method, callback } ) => {
  const xhr = new XMLHttpRequest();
  // open
  if (method === 'GET') {
    url = modifyGetURL( url, data );
  }
  try {
    xhr.open( method, url );
  } catch (error) {
    console.error( error );
    callback( error );
    return;
  }

  // set params
  for (let [key, value] of Object.entries( headers )) {
    xhr.setRequestHeader( key, value );
  }
  xhr.responseType = responseType;
  xhr.withCredentials = true;
  xhr.onerror = e => callback( {status: xhr.status, statusText: xhr.statusText}, null );
  xhr.onload = e => callback( null, xhr.response );

  // send
  let body = null;
  if (method !== 'GET') {
    body = new FormData();
    for (let [key, value] of Object.entries( data )) {
      body.append( key, value );
    }
  }
  try {
    xhr.send( body );
  } catch (error) {
    console.error( error );
    callback( error );
    return;
  }
  
  function modifyGetURL( url, data ) {
    const pairs = Object.entries( data );
    if (!pairs.length) {
      return url;
    }
    url += `?${pairs[0][0]}=${pairs[0][1]}`;
    for (let i = 1; i < pairs.length; i++) {
      url += `&${pairs[i][0]}=${pairs[i][1]}`;
    }
    return url;
  }
};
