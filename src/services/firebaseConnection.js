
/*  VERSÃO 8 do firebase
import firebase from "firebase/app";
import "firebase/auth";  
import "firebase/firestore";
*/

// VERSÃO 9 compatível do firebase. Depois é interessante corrigir todo o código para versão MODULAR
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Para editar ARQUIVOS de usuário
import 'firebase/compat/storage';


  const firebaseConfig = {
    apiKey: "AIza5esw5e5e5e55#E#EE#E#E##EE#6f7WA",
    authDomain: "sistema-e3e333ee3e3firebaseapp.com",
    projectId: "sistema-733#E#E#EE#7",
    storageBucket: "sistema-7E#E##E#7.appspot.com",
    messagingSenderId: "5e33e##E#E#EE#E##E8",
    appId: "1:5E#E##EEE#E#E#8:web:9E#E#E##E#E#EEE#E#E#2dc15",
    measurementId: "GE#E#E#E#EE#0J"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
 
  export default firebase;
