/**
 * Основной компонент клиента приложения.
 * Отправная точка
 */
$(document).ready(function() {
  const { PAGES } = SETTINGS;

  // Константа со всеми базовыми селекторами
  const $SELECTORS = {
    loginBlock: $('.auth-reg-block__auth'),
    regBlock: $('.auth-reg-block__reg'),
    mainBlock: $('.main-block'),
    toLoginBtn: $('#go-to-auth-button'),
    toRegBtn: $('#go-to-reg-button'),
    loginRegContainer: $('.auth-reg-block'),
    chatBlock: $('.chat-block'),
    mainContainer: $('.main-container'),
  };

  /**
   * Метод показывающий нужную страницу по запросу
   * @param page страница, которую нужно показать
   */
  function showPage(page) {
    $SELECTORS.regBlock.hide();
    $SELECTORS.loginBlock.hide();
    $SELECTORS.toRegBtn.hide();
    $SELECTORS.toLoginBtn.hide();
    $SELECTORS.loginRegContainer.hide();
    $SELECTORS.mainContainer.hide();
    switch (page) {
      case PAGES.LOGIN:
        $SELECTORS.loginRegContainer.css('display', 'flex');
        $SELECTORS.loginBlock.css('display', 'flex');
        $SELECTORS.toRegBtn.show();
        break;
      case PAGES.REGISTRATION:
        $SELECTORS.loginRegContainer.css('display', 'flex');
        $SELECTORS.regBlock.css('display', 'flex');
        $SELECTORS.toLoginBtn.show();
        break;
      case PAGES.MAIN:
        $SELECTORS.mainContainer.show();

        break;
    }
  }

  const mediator = new Mediator({ ...SETTINGS.MEDIATOR });
  const server = new Server({ ...SETTINGS });

  new Registration({ ...SETTINGS, $SELECTORS, showPage, server });
  new Login({ ...SETTINGS, $SELECTORS, showPage, server, mediator });
  new MainManager({ ...SETTINGS, $SELECTORS, showPage, server, mediator });

  showPage(PAGES.LOGIN);
});
