/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent( user ) {
    localStorage.user = JSON.stringify( user );
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    delete localStorage.user;
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const user = localStorage.user;
    if (!user) {
      return;
    }
    let data;
    try {
      data = JSON.parse( user );
    } catch (error) {
      console.error( error );
      return;
    }
    return data;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( callback ) {
    const cb = callback; // чтобы в рекурсию не ушло
    createRequest( {
      url: this.URL + '/current',
      responseType: 'json',
      method: 'GET',
      callback( error, response ) {
        if (response) {
          if (response.success) {
            User.setCurrent( response.user );
          } else {
            User.unsetCurrent();
          }
        }
        cb( error, response);
      }
    } );
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback ) {
    if (!(data.email && data.password)) {
      console.error( 'Не хватает данных для входа' );
      return;
    }
    const cb = callback;
    createRequest( {
      url: this.URL + '/login',
      data,
      responseType: 'json',
      method: 'POST',
      callback( error, response ) {
        response && response.success && User.setCurrent( response.user );
        cb( error, response );
      }
    } );
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback ) {
    if (!(data.name && data.email && data.password)) {
      console.error( 'Не хватает данных для регистрации' );
      return;
    }
    const cb = callback;
    createRequest( {
      url: this.URL + '/register',
      data,
      responseType: 'json',
      method: 'POST',
      callback( error, response ) {
        response && response.success && User.setCurrent( response.user );
        cb( error, response );
      }
    } ); 
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback ) {
    const cb = callback;
    createRequest( {
      url: this.URL + '/logout',
      data,
      responseType: 'json',
      method: 'POST',
      callback( error, response ) {
        response && response.success && User.unsetCurrent();
        cb( error, response );
      }
    } );
  }
}
