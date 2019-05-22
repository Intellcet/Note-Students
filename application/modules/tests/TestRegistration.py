import unittest
from selenium import webdriver
import time


class TestRegistration(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:8080/")

    def test_correct_Reg(self):
        self.buttonReg = self.driver.find_element_by_xpath("//*[@id='go-to-reg-button']").click()
        self.loginFieldReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[1]").send_keys("misha")
        self.fullnameFieldReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[2]").send_keys("Петров Миша")
        self.passwordField = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[3]").send_keys("123")
        self.passwordFieldRepeat = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[4]").send_keys("123")
        self.buttonNewReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/button").click()
        time.sleep(2)
        assert "Авторизация" in self.driver.page_source
        time.sleep(2)

    def test_incorrect_Fullname(self):
        self.buttonReg = self.driver.find_element_by_xpath("//*[@id='go-to-reg-button']").click()
        self.loginFieldReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[1]").send_keys(
            "evgen")
        self.fullnameFieldReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[2]").send_keys(
            "Евгений")
        self.passwordField = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[3]").send_keys("123")
        self.passwordFieldRepeat = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[4]").send_keys(
            "123")
        self.buttonNewReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/button").click()
        assert "ФИО должно состоять минимум из двух слов" in self.driver.page_source

    def test_incorrect_Repeat_Pass(self):
        self.buttonReg = self.driver.find_element_by_xpath("//*[@id='go-to-reg-button']").click()
        self.loginFieldReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[1]").send_keys(
            "evgen")
        self.fullnameFieldReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[2]").send_keys(
            "Осипов Евгений")
        self.passwordField = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[3]").send_keys("123")
        self.passwordFieldRepeat = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/input[4]").send_keys(
            "1234")
        self.buttonNewReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/button").click()
        assert "Пароли не совпадают" in self.driver.page_source

    def test_empty_Field(self):
        self.buttonReg = self.driver.find_element_by_xpath("//*[@id='go-to-reg-button']").click()
        self.buttonNewReg = self.driver.find_element_by_xpath("/html/body/div[2]/div[2]/div/button").click()
        assert "Введены не все данные" in self.driver.page_source

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()
