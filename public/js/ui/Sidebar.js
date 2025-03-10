/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    document.querySelector( '.sidebar-toggle[data-toggle="push-menu"]' ).
      addEventListener( 'click', evt => {
        evt.preventDefault();
        document.body.classList.toggle( 'sidebar-open' );
        document.body.classList.toggle( 'sidebar-collapse' );
      } );
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    document.querySelector( '.menu-item_login' ).
      addEventListener( 'click', evt => {
        evt.preventDefault();
        App.getModal( 'login' ).open();
      } );

    document.querySelector( '.menu-item_register' ).
      addEventListener( 'click', evt => {
        evt.preventDefault();
        App.getModal( 'register' ).open();
      } );

    document.querySelector( '.menu-item_logout' ).
      addEventListener( 'click', evt => {
        evt.preventDefault();
        User.logout( {}, ( failed, success ) => 
          success && success.success && App.setState( 'init' )
        );
      } );
  }
}