import styles from "./styles.module.scss";
import { VscSignOut, VscGithubInverted } from "react-icons/vsc";
import { useAuth } from "../../contexts/auth";
import { useState, FormEvent } from "react";
import { api } from "../../services/api";

export function SendMessageForm() {
  const { user, signOut } = useAuth();
  const [message, setMessage] = useState("");

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    try {
      await api.post("/messages", { message });
      setMessage("");
    } catch (err) {}
  };

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </strong>
      </header>

      <form className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          id="message"
          name="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <button type="submit" onClick={handleSendMessage}>
          Enviar Mensagem
        </button>
      </form>
    </div>
  );
}
