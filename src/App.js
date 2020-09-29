import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
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
    <>
      <button className='sign-in' onClick={signInWith(googleProvider)}>
        Sign in with Google
      </button>
      <button className='sign-in' onClick={signInWith(githubProvider)}>
        Sign in with GitHub
      </button>

      <p>Sign in with your google or github account</p>
    </>
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
  const scrollToDummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
    scrollToDummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map((msg) => <Message key={msg.id} message={msg} />)}

        <span ref={scrollToDummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='type your message...' />
        <button type='submit' disabled={!formValue}></button>
      </form>
    </>
  );
}

function Message(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const displayName = auth.currentUser.displayName;

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={photoURL || `https://eu.ui-avatars.com/api/?name=${displayName}`}
          alt={`${displayName}'s user avatar`}
        />

        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
