/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  element;
  #activeAccount = null;
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error( 'There is no element' );
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener( 'click', evt => {
      evt.preventDefault();
      const account = evt.target.closest( '.account' );
      if (account) {
        this.onSelectAccount( account );
      }
      else if (evt.target.matches( '.create-account' )) {
        App.getModal( 'createAccount' ).open();
      }
    } );
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    Account.list( {}, ( error, response ) => {
      if (response && response.success) {
        this.clear();
        this.render( response.data );
      }
    } );
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.innerHTML = '';
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    if(this.#activeAccount) {
      this.#activeAccount.classList.remove( 'active' );
    }
    this.#activeAccount = element;
    element.classList.add( 'active' );
    App.showPage( 'transactions', { account_id: element.dataset.id } );
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML( item ) {
    return `
      <li class="account" data-id="${item.id}">
        <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} <span class="currency">₽</span></span>
        </a>
      </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  render( data ) {
    let html = 
      `<li class="header">
        Счета
        <div class="pull-right">
          <span class="create-account label label-success">
            <span class="fa fa-plus"></span>
              Новый счёт
            </span>
          </div>
      </li>`;
    html += data.reduce( ( res, cur ) => res + this.getAccountHTML( cur ), '' );
    this.element.innerHTML = html;
  }
}
