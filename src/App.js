import React, { useState } from 'react';
import './App.css';
import CryptoJS from 'crypto-js';

function App() {
  const [text, setText] = useState("");
  const [screen, setScreen] = useState("encrypt");
  const [errorMessage, setErrorMessage] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [enteredKey, setEnteredKey] = useState("");

  const switchScreen = (type) => {
    setScreen(type);
    setText("");
    setDecryptedData("");
    setEncryptedData("");
    setErrorMessage("");
    setEnteredKey("");
    setSecretKey("") // Reset entered key when switching screens
  }

  const encrypData = () => {
    if (!secretKey) {
      setErrorMessage("Please enter the secret key");
      return;
    }

    try {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(text), secretKey
      ).toString();
      setEncryptedData(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Encryption failed");
    }
  }

  const decryptData = () => {
    if (!enteredKey) {
      setErrorMessage("Please enter the key used for encryption");
      return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(text, enteredKey);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(data);
      setErrorMessage("");
    } catch {
      setErrorMessage("Decryption failed");
    }
  }

  const handleClick = () => {
    if (!text) {
      setErrorMessage("Please enter some text");
      return;
    }

    if (screen === "encrypt") {
      encrypData();
    } else {
      decryptData();
    }
  }

  return (
    <div className="container">
      <h2> Encryption and Decryption</h2>
      <div>
        <button className={`btn btn-left ${screen === "encrypt" ? "active" : ""}`} 
                onClick={() => { switchScreen("encrypt") }}>
          Encrypt
        </button>
        <button className={`btn btn-right ${screen === "decrypt" ? "active" : ""}`} 
                onClick={() => { switchScreen("decrypt") }}>
          Decrypt
        </button>
      </div>
      <div className='card'>
        {/* Textarea for input */}
        <textarea
          value={text}
          onChange={({target}) => setText(target.value)}
          placeholder={screen === "encrypt" ? "Enter your Text" : "Enter Encrypted data"}
        ></textarea>
        {errorMessage && <div className='error'>{errorMessage}</div>}
        {screen === "encrypt" && (
          <input
            type="password"
            value={secretKey}
            onChange={({target}) => setSecretKey(target.value)}
            placeholder="Enter secret key"
          />
        )}
        {screen === "decrypt" && (
          <input
            type="password"
            value={enteredKey}
            onChange={({target}) => setEnteredKey(target.value)}
            placeholder="Enter encryption key"
          />
        )}
        <button className={`btn submit-btn ${screen === "encrypt" ? "encrpt-btn" : "decrypt-btn"}`} 
                onClick={handleClick}>
          {screen === "encrypt" ? "Encrypt" : "Decrypt"}
        </button>
      </div>
      {(screen === "encrypt" && encryptedData) || (screen === "decrypt" && decryptedData) ? (
        <div className='content'>
          <label>{screen === "encrypt" ? "Encrypted" : "Decrypted"} Data</label>
          <p>{screen === "encrypt" ? encryptedData : decryptedData}</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
