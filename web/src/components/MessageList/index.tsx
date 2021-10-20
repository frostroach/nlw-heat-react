import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import io from "socket.io-client";
import { api } from "../../services/api";
import { Message } from "../../models/messages";

const socket = io("http://localhost:4000");

const messagesQueue: Message[] = [];

socket.on("new_message", (newMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messagesData, setMessagesData] = useState<Message[]>([]);

  const loadMessages = async () => {
    try {
      const response = await api.get<Message[]>("/messages/last3");
      console.log(response.data);
      const { data } = response;
      if (data) {
        setMessagesData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessagesData((prevState) =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
        );

        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile2021" />
      <ul className={styles.messageList}>
        {messagesData.map((item) => {
          return (
            <li className={styles.message} key={item.id}>
              <p className={styles.messageContent}>{item.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={item.user.avatar_url} alt={item.user.name} />
                </div>
                <span>{item.user.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
