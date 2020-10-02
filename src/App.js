import React, { useEffect, useRef, useState } from 'react';
import { styled } from './styles';

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

const AppContainer = styled.div`
  text-align: center;
`;

const Header = styled.header`
  padding: 0.5rem 1rem;
  min-height: 6rem;
  width: 100%;

  position: fixed;
  top: 0;
  z-index: 99;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${(p) => p.theme.mainBackground};

  h1 {
    font-size: 1.5rem;
  }

  button {
    padding: 0.75rem 1.25rem;
    font-size: 1.25rem;

    background-color: #f0f0f0;
    border: 0;
    border-radius: 3rem;
    box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0, 0, 0, 0.2);
  }

  @media screen and (min-width: 768px) {
    padding: 1rem 2rem;

    h1 {
      font-size: 2.5rem;
    }

    button {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
  }
`;

const Section = styled.section`
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

const SignInButtons = styled.main`
  margin-top: 6rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
`;

const Main = styled.main`
  padding: 0.5rem;
  margin-top: 6rem;
  margin-bottom: 6rem;

  overflow-y: auto;

  @media screen and (min-width: 768px) {
    padding: 1rem;
  }
`;

const MessageContainer = styled.div`
  margin-top: 3rem;
  height: auto;

  position: relative;

  display: flex;
  flex-flow: ${(props) => (props.messageType === 'sent' ? 'row-reverse' : 'row')};
  align-items: flex-start;

  & > span {
    position: absolute;
    top: -1.5rem;
    padding: 0 6.5rem;

    color: #8b8b8b;
  }

  img {
    width: 3rem;

    border-radius: 50%;
    box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0, 0, 0, 0.2);
  }

  p {
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    max-width: 70%;

    background-color: #f0f0f0;
    border-radius: 1.5rem;
    box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0, 0, 0, 0.2);

    text-align: left;
    font-size: 1rem;
    line-height: 1.25em;
    word-wrap: break-word;
  }

  @media screen and (min-width: 768px) {
    img {
      width: 4rem;
    }
  }
`;

const Form = styled.form`
  padding: 1rem;
  height: 6rem;
  width: 100%;

  position: fixed;
  bottom: 0;

  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${(p) => p.theme.mainBackground};

  input {
    padding: 0.5rem 1rem;
    width: 100%;

    background-color: #f0f0f0;
    border: 5px solid #f0f0f0;
    border-radius: 2.5rem;
    box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0, 0, 0, 0.2), inset -5px -5px 10px #ffffff,
      inset 5px 5px 10px rgba(0, 0, 0, 0.2);
    outline: 0;

    font-size: 1.4rem;
  }

  button {
    padding: 1rem;
    margin-left: 1rem;
    width: 4rem;
    height: 4rem;
    font-size: 2rem;

    background-color: #f0f0f0;
    border: 0;
    border-radius: 50%;
    box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0, 0, 0, 0.2);
  }

  button span {
    text-align: center;
    font-size: 2rem;
    line-height: 2rem;
  }
`;

function App() {
  const [user] = useAuthState(auth);

  return (
    <AppContainer>
      <Header>
        <h1>
          Firebase + React Chat{' '}
          <span role='img' aria-label='Fire emoji'>
            🔥
          </span>
        </h1>
        <SignOut />
      </Header>
      <Section>{user ? <ChatRoom /> : <SignIn />}</Section>
    </AppContainer>
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
      <SignInButtons>
        <GoogleLoginButton className='sign-in' onClick={signInWith(googleProvider)} />
        <GithubLoginButton className='sign-in' onClick={signInWith(githubProvider)} />
      </SignInButtons>

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
    <>
      <Main>
        {messages && messages.map((msg) => <Message key={msg.id} message={msg} />)}

        <div ref={messagesEnd}></div>
      </Main>

      <Form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='type your message...' />
        <button type='submit' disabled={!formValue}>
          <span role='img' aria-label='send message (letter emoji)'>
            💌
          </span>
        </button>
      </Form>
    </>
  );
}

function Message(props) {
  const { text, createdAt, uid, displayName, photoURL } = props.message;

  const messageType = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <MessageContainer messageType={messageType} data-created-at={createdAt}>
      <span>{displayName}</span>

      <img src={photoURL || `https://eu.ui-avatars.com/api/?name=${displayName}`} alt={`${displayName} user avatar`} />

      <p>
        <Linkify>{text}</Linkify>
      </p>
    </MessageContainer>
  );
}

export default App;
