import React, { useState } from 'react';

import { useSocket } from '../../../../components/Socket';

import styles from './Chat.module.pcss';

const Chat = (): React.ReactElement => {
  const [message, setMessage] = useState('');

  const socket = useSocket();

  const handleSendMessageButtonClick = (
    ev: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    ev.preventDefault();
    console.log(message);
  };

  const handleMessageInputChange = (
    ev: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const {
      currentTarget: { value },
    } = ev;
    setMessage(value.trim());
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessagesContainer} />
      <form className={styles.chatInputContainer}>
        <input
          onChange={handleMessageInputChange}
          value={message}
          className={styles.chatInput}
          type="text"
          placeholder="Введите текст"
        />
        <button
          className={styles.sendMessageButton}
          type="submit"
          onClick={handleSendMessageButtonClick}
        >
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Chat;
