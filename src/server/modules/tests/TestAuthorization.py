import unittest
from selenium import webdriver
import time


class TestAuthorization(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:8080/")

    def test_auth_marat(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("marat")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys("123")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        time.sleep(1)
        self.msgAuth = self.driver.find_element_by_xpath("//*[@id='chat']/p")
        self.assertEqual(self.msgAuth.text, "Зарипов Марат Наилевич: Пользователь Зарипов Марат Наилевич подключился!",
                         "Сообщения об авторизации нет")

    def test_auth_vasya(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("vasya")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys("123")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        time.sleep(1)
        self.msgAuth = self.driver.find_element_by_xpath("//*[@id='chat']/p")
        self.assertEqual(self.msgAuth.text, "Иванов Василий Петрович: Пользователь Иванов Василий Петрович подключился!",
                         "Сообщения об авторизации нет")

    def test_auth_incorrect_password(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("vasya")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys("322")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.errMsg = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/p")
        self.assertEqual(self.errMsg.text, "Неверные логин и(или) пароль!", "Нет сообщения")

    def test_auth_incorrect_login(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("vasya1")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys("123")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.errMsg = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/p")
        self.assertEqual(self.errMsg.text, "Неверные логин и(или) пароль!", "Нет сообщения")

    def test_auth_incorrect_login_and_password(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("evgen")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys("322")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.errMsg = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/p")
        self.assertEqual(self.errMsg.text, "Неверные логин и(или) пароль!", "Нет сообщения")

    def test_auth_empty_fields(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys("")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.errMsg = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/p")
        self.assertEqual(self.errMsg.text, "Не введен логин и(или) пароль!", "Нет сообщения")

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()
