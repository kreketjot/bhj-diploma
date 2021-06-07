/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  element;
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error( 'There is no element' );
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.querySelector( '.create-income-button' ).
      addEventListener( 'click', evt => {
        App.getModal( 'newIncome' ).open();
        App.getForm("createIncome").renderAccountsList();
      } );

    this.element.querySelector( '.create-expense-button' ).
      addEventListener( 'click', evt => {
        App.getModal( 'newExpense' ).open();
        App.getForm("createExpense").renderAccountsList();
      } );
  }
}
