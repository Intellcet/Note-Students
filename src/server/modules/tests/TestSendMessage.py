import unittest
from selenium import webdriver
import time


class TestSendMessage(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:8080/")

    def test_message_marat(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("marat")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys(
            "123")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.fieldMessage = self.driver.find_element_by_xpath("//*[@id='message']").send_keys("Привет")
        time.sleep(1)
        self.buttonSendMessage = self.driver.find_element_by_xpath("//*[@id='sendMessage']").click()
        time.sleep(1)
        self.chatMsg = self.driver.find_element_by_xpath("//*[@id='chat']/p[1]")
        self.assertEqual(self.chatMsg.text, "Зарипов Марат Наилевич: Привет", "Нет сообщения 'Привет' от Марата")

    def test_message_vasya(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("vasya")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/ div[2]/div[1]/div/input[2]").send_keys(
            "123")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.fieldMessage = self.driver.find_element_by_xpath("//*[@id='message']").send_keys("Привет")
        time.sleep(1)
        self.buttonSendMessage = self.driver.find_element_by_xpath("//*[@id='sendMessage']").click()
        time.sleep(1)
        self.chatMsg = self.driver.find_element_by_xpath("//*[@id='chat']/p[1]")
        self.assertEqual(self.chatMsg.text, "Иванов Василий Петрович: Привет", "Нет сообщения 'Привет' от Василия")

    def test_empty_message(self):
        self.fieldName = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[1]").send_keys("vasya")
        self.fieldPassword = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/input[2]").send_keys(
            "123")
        self.buttonAuth = self.driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/button").click()
        self.buttonSendMessage = self.driver.find_element_by_xpath("//*[@id='sendMessage']").click()
        time.sleep(1)
        self.chatMsg = self.driver.find_element_by_xpath("//*[@id='chat']/p[1]")
        self.assertNotEqual(self.chatMsg.text, "Иванов Василий Петрович: Привет", "Сообщение 'Привет' появилось ")

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
        unittest.main()
