import React, { useEffect, useRef, useState } from 'react';
import 'reset-css';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
//const analytics = firebase.analytics();

import { GoogleLoginButton, GithubLoginButton } from 'react-social-login-buttons';
import Linkify from 'react-linkify';

firebase.initializeApp({
  apiKey: 'AIzaSyCLEWjOA7EKrJlbp4Yh0PcPsnEK50TKGr8',
  authDomain: 'bblk-demos.firebaseapp.com',
  databaseURL: 'https://bblk-demos.firebaseio.com',
  projectId: 'bblk-demos',
  storageBucket: 'bblk-demos.appspot.com',
  messagingSenderId: '475010900777',
  appId: '1:475010900777:web:87c1dbf199efdabaebcd38',
  measurementId: 'G-0L2MRQMMF2',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header className='app-header'>
        <h1>
          Firebase + React Chat{' '}
          <span role='img' aria-label='Fire emoji'>
            🔥
          </span>
        </h1>
        <SignOut />
      </header>
      <section className='container'>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const githubProvider = new firebase.auth.GithubAuthProvider();

  const signInWith = (provider) => {
    return () => auth.signInWithPopup(provider);
  };

  return (
    <section className='sign-in-wrapper'>
      <GoogleLoginButton className='sign-in' onClick={signInWith(googleProvider)} />
      <GithubLoginButton className='sign-in' onClick={signInWith(githubProvider)} />

      <p>Sign in with your google or github account</p>
    </section>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Sign out
      </button>
    )
  );
}

function ChatRoom() {
  const messagesEnd = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  });

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, displayName, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setFormValue('');
  };

  return (
    <section className='chat-wrapper'>
      <main className='messages-container'>
        {messages && messages.map((msg) => <Message key={msg.id} message={msg} />)}

        <div ref={messagesEnd}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='type your message...' />
        <button type='submit' disabled={!formValue}>
          <span role='img' aria-label='send message (letter emoji)'>
            💌
          </span>
        </button>
      </form>
    </section>
  );
}

function Message(props) {
  const { text, createdAt, uid, displayName, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`} data-createdAt={createdAt}>
        <span className='sender-name'>{displayName}</span>

        <img
          src={photoURL || `https://eu.ui-avatars.com/api/?name=${displayName}`}
          alt={`${displayName} user avatar`}
        />

        <p>
          <Linkify>{text}</Linkify>
        </p>
      </div>
    </>
  );
}

export default App;
