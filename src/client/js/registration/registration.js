/**
 * Конструктор для инкапсуляции логики регистрации
 * @param options параметры с которыми вызывается конструктор
 */
function Registration(options) {
  options = options instanceof Object ? options : {};

  const { $SELECTORS } = options;
  const { PAGES } = options;
  const showPage =
    options.showPage instanceof Function ? options.showPage : () => {};

  const { server } = options;

  /**
   * Метод, разбивающий строку с ФИО на массив с 2 элементами, как минимум
   * @param nameField строка которую нужно разбить
   * @returns пустой массив, если было введено одно слово или ни одно или массив со строками
   */
  function normalizeName(nameField) {
    const longName = nameField.val();
    return longName && longName.length >= 2 ? longName.split(' ') : [];
  }

  /**
   * Функция-регистрация
   * @param e событие нажатия на кнопку
   */
  async function registration(e) {
    const loginField = $('.auth-reg-block__reg__input-login-js');
    const nameField = $('.auth-reg-block__reg__input-name-js');
    const passwordField = $('.auth-reg-block__reg__input-password-js');
    const login = loginField.val();
    const longName = normalizeName(nameField);
    const password1 = $(passwordField[0]).val();
    const password2 = $(passwordField[1]).val();
    const group = $('.auth-reg-block__select-js').val();
    if (login && password1 && password2 && longName && group) {
      if (longName.length >= 2) {
        if (password1 === password2) {
          const password = md5(login + password1);
          const surname = longName[0];
          const firstname = longName[1];
          const thirdname = longName[2];
          const name = [surname, firstname, thirdname].join(' ');
          const result = await server.registration({
            login,
            password,
            group,
            name,
            type: 0,
          });
          if (result.result === 'ok') {
            loginField.val('');
            nameField.val('');
            passwordField.val('');
            $('.auth-reg-block__error-reg-js').empty();
            showPage(PAGES.LOGIN);
            return;
          }
          $('.auth-reg-block__error-reg-js')
            .empty()
            .append('Пользователь с таким логином уже существует');
          return;
        }
        $('.auth-reg-block__error-reg-js')
          .empty()
          .append('Пароли не совпадают');
        return;
      }
      $('.auth-reg-block__error-reg-js')
        .empty()
        .append('ФИО должно состоять минимум из двух слов');
      return;
    }
    $('.auth-reg-block__error-reg-js')
      .empty()
      .append('Введены не все данные');
  }

  /**
   * Метод-обработчик всех событий, касательно регистрации
   */
  function eventHandler() {
    $('.auth-reg-block__reg__button-js').on('click', registration);
    $SELECTORS.toLoginBtn.on('click', e => {
      $('.auth-reg-block__error-reg-js').empty();
      showPage(PAGES.LOGIN);
    });
  }

  /**
   * Функция-инициализатор компонента
   */
  function init() {
    eventHandler();
  }
  init();
}
