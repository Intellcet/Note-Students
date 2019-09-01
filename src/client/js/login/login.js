/**
 * Конструктор для инкапсуляции логики входа в систему
 * @param options параметры с которыми вызывается конструктор
 */

function Login(options) {
  options = options instanceof Object ? options : {};

  const { $SELECTORS } = options;
  const { PAGES } = options;
  const showPage =
    options.showPage instanceof Function ? options.showPage : () => {};
  const { SOCKET_EVENTS } = options;

  const { mediator } = options;
  const { EVENTS } = mediator;
  const { TRIGGERS } = mediator;

  const { server } = options;
  const { socket } = options;

  /**
   * Заполняем выпадашку с группами
   * @param groups массив групп, которыми нужно заполнить выпадашку
   */
  function fillGroups(groups) {
    const select = $('.auth-reg-block__select-js');
    select.empty();
    for (let group of groups) {
      select.append(
        `<option class="auth-reg-block__select-elem">${group.code}</option>`
      );
    }
  }

  /**
   * Функция входа в сиситему
   * @param e событие клика на кнопку
   */
  async function login(e) {
    const loginField = $('.auth-reg-block__input-login-js');
    const passwordField = $('.auth-reg-block__input-password-js');
    const login = loginField.val();
    let password = passwordField.val();
    if (login && password) {
      const rnd = Math.random();
      password = md5(md5(login + password) + rnd);
      const result = await server.login({ login, password, rnd });
      if (result.result === 'ok') {
        server.token = result.data;
        loginField.val('');
        passwordField.val('');
        localStorage.setItem('token', server.token);
        $('.auth-reg-block__error-login-js').empty();
        showPage(PAGES.MAIN);
        mediator.call(EVENTS.LOGGED_IN);
        mediator.call(EVENTS.ADMIN_LOGIN);
        qrToken = localStorage.getItem(
          'token'
        ); /* Берём токен пользователя из лок.хранилища */
        return;
      }
      $('.auth-reg-block__error-login-js')
        .empty()
        .append('Неверные логин и(или) пароль!');
      return;
    }
    $('.auth-reg-block__error-login-js')
      .empty()
      .append('Не введен логин и(или) пароль!');
  }

  /* обработчик кнопки сгенерить qrCode */
  $('.generateQrCode').click(function() {
    $('#qrcode').html('Действующий QR-Code');
    let qrcode = new QRCode(document.getElementById('qrcode'), {
      width: 200,
      height: 200,
    });
    qrcode.makeCode(qrToken);
  });

  /**
   * Функция-обработчик всех событий, касающихся Login-а
   */
  function eventHandler() {
    $('.auth-reg-block__button-login-js').on('click', login);

    /**
     * Вешаем событие на кнопку "перейти к регистрации" и обрабатываем его
     */
    $SELECTORS.toRegBtn.on('click', async e => {
      const result = await server.getGroupsCodes();
      fillGroups(result.data);
      $('.auth-reg-block__error-login-js').empty();
      showPage(PAGES.REGISTRATION);
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
