/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage { 
  element;
  lastOptions = null;
  title;
  content;
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error( 'There is no element' );
    }
    this.element = element;
    this.registerEvents();
    this.title = element.querySelector( '.content-title' );
    this.content = element.querySelector( '.content' );
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render( this.lastOptions );
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener( 'click', evt => {
      if (evt.target.matches( '.transaction__remove' ) ) {
        this.removeTransaction( evt.target.dataset.id )
      } else if (evt.target.matches( '.remove-account' ) ) {
        this.removeAccount();
      }
    } );
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    const del = confirm( 'Вы действительно хотите удалить счёт?' );
    if (del) {
      const data = {
        id: this.lastOptions.account_id
      };
      Account.remove( data, ( error, response ) => {
        if (response) {
          this.clear();
          App.updateWidgets();
        }
      } );
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const del = confirm( 'Вы действительно хотите удалить эту транзакцию?' );
    if (del) {
      Transaction.remove( { id }, ( error, response ) => {
        if (response) {
          App.update();
        }
      } );
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if (!options) {
      return;
    }
    this.lastOptions = options;
    Account.get( options.account_id, ( error, response ) => {
      if (response) {
        const title = response.data.find( 
          item => item.id === options.account_id ).name;
        this.renderTitle( title );
      }
    } );
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions( [] );
    this.renderTitle();
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name = 'Название счёта' ) {
    this.title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    const months = [ 
      'января', 
      'февраля', 
      'марта', 
      'апреля', 
      'мая', 
      'июня', 
      'июля', 
      'августа', 
      'сентября', 
      'октября', 
      'ноября', 
      'декабря'
    ];
    const arr = date.split(' ');
    const yyyy_mm_dd = arr[0].split('-');
    const hh_mm_ss = arr[1].split(':');
    return `${+yyyy_mm_dd[2]} ${months[yyyy_mm_dd[1] - 1]} ${+yyyy_mm_dd[0]} г.` + 
      ` в ${hh_mm_ss[0]}:${hh_mm_ss[1]}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( item ) {
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate( item.created_at )}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    const html = data.reduce( 
      ( res, cur ) => res + this.getTransactionHTML( cur ), '');
    this.content.innerHTML = html;
  }
}