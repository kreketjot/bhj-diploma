/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  accountsSelect;
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super( element );
    this.renderAccountsList();
    this.accountsSelect = element.querySelector( '.accounts-select' );
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list( User.current(), ( error, response ) => {
      if (response) {
        const html = response.data.reduce( 
          ( res, cur ) => res + `<option value="${cur.id}">${cur.name}</option>\n`, '' );
        this.accountsSelect.innerHTML = html;
      }
    } );
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( data ) {
    Transaction.create( data, ( error, response ) => {
      if (response) {
        this.element.reset();
        App.getModal( 'newIncome' ).close();
        App.getModal( 'newExpense' ).close();
        App.update();
      }
    } );
  }
}