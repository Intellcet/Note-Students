/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';

import { SOCKET_EVENTS } from '../../../../../share/socketEvents';
import { useSocket } from '../../../../components/Socket';

import styles from './Chat.module.pcss';

type MessageType = {
  id: number;
  name: string;
  text: string;
};

const Chat = (): React.ReactElement => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);

  const socket = useSocket();

  const handleSendMessageButtonClick = (
    ev: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    ev.preventDefault();
    if (message) {
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { text: message });
    }
  };

  const handleMessageInputChange = (
    ev: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const {
      currentTarget: { value },
    } = ev;
    setMessage(value.trim());
  };

  useEffect(() => {
    socket.on(SOCKET_EVENTS.SEND_MESSAGE_TO_ALL, (value: MessageType) => {
      allMessages.push(value);
      setAllMessages(allMessages.map(mes => ({ ...mes })));
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    socket.emit(SOCKET_EVENTS.NEW_USER_CAME, { token });
  }, []);

  return (
    <div className={styles.chatContainer}>
      {allMessages.length > 0 && (
        <div className={styles.chatMessagesContainer}>
          {allMessages.map((message, idx) => (
            <p key={message.id + String(idx)}>
              <strong>{message.name}: </strong> {message.text}
            </p>
          ))}
        </div>
      )}
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
