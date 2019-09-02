/**
 * Конструктор для инкапсуляции основных событий клиента приложения
 * @param options параметры с которыми вызывается конструктор
 */
function UI(options) {
  options = options instanceof Object ? options : {};

  const { $SELECTORS } = options;
  const { PAGES } = options;

  const { mediator } = options;
  const { EVENTS } = mediator;
  const { TRIGGERS } = mediator;

  $SELECTORS.DATE = $('.main-block_date-js');
  $SELECTORS.SELECT = $('.main-block_select-js');
  $SELECTORS.LIST_BTN = $('.main-block_list-btn-js');

  /**
   * Функция-обработчик основных событий клиента
   */
  function baseEventHandler() {
    $('.main-block__logout-button-js')
      .off('click')
      .on('click', e => mediator.call(EVENTS.LOGOUT));
  }

  /**
   * Функция-обработчик всех событий админа
   */
  this.adminEventHandler = flag => {
    if (flag) {
      $SELECTORS.LIST_BTN.off('click').on('click', e => {
        let date = $SELECTORS.DATE.val();
        let lessonNum = $SELECTORS.SELECT.val();
        mediator.call(EVENTS.GET_STUDENTS_ON_LESSON, { date, lessonNum });
      });
      return;
    }
    $SELECTORS.LIST_BTN.off('click');
  };

  /**
   * Функция-инициализатор компонента
   */
  function init() {
    baseEventHandler();
  }
  init();
}
