import { toast } from 'react-toastify';

import { useState, useEffect, createContext} from 'react';
import firebase from '../services/firebaseConnection';

export const AuthContext = createContext({});

//prover
function AuthProvider({ children }){

    //teste para dashboard
    //const [user, setUser] = useState({id: 1, nome: "Leandro"}); // testar http://localhost:3000/dashboard

    const [user, setUser] = useState(null);  //Inicia como logout
    const [loadingAuth, setLoadingAuth] = useState(false); // após login mudar para true lá na função
    const [loading, setLoading] = useState(true); // iniciar carregando

    //useEffect para saber se tem algum usuário logado:
    useEffect(()=>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                //se já tiver usuário:
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage();

    },[])


//função para cadastarr usuário:
async function signUp( email, password, nome ){
    //alterar para true:
    setLoadingAuth(true);
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( async(value)=>{      
        let uid =value.user.uid;
        
          //cadastrar no DB
        await firebase.firestore().collection('users')
        .doc(uid).set({
            nome: nome,
            avatarUrl: null, //vai começar com a imagema avatar padrão
        })
        .then( ()=>{
            // disponibilizar para o setUser
            let data = {
                uid: uid,
                nome: nome,
                email: value.user.email,
                avatarUrl: null,
            }//passar data para setUser. Pode salvar em localStorage também, mais abaixo
            setUser(data);
            storageUser(data); //Veja função criada mais abaixo

            setLoadingAuth(false);

            toast.success('Bem vindo à plataforma');

        })
    })//Tratar os casos de erros
    .catch((error)=>{
        console.log(error);
        toast.error('Opss! Algo deu errado...');
        setLoadingAuth(false);        
    })



}//localStorage salvar data aqui também


function storageUser(data){
    localStorage.setItem('SistemaUser', JSON.stringify(data)) //'SistemaUser' foi o nome dado acima em localStorage
}

// signout
async function signOut() {
    await firebase.auth().signOut();

    //limpar localStorage
    localStorage.removeItem('SistemaUser');

    //voltar ao estado normal do user que é null
    setUser(null);


    //precisa disponibilizar essa função em AutoContext.Provider value
}


//Criar o acesso login do usuário:
async function signIn(email, password){
    setLoadingAuth(true); //Para logar, passar para true

    await firebase.auth().signInWithEmailAndPassword(email, password)
    //Quando logar recebe value
    .then(async (value)=>{ // Se logou vai entrar em then
        let uid = value.user.uid;

        const userProfile = await firebase.firestore().collection('users').doc(uid).get(); //.get é para buscar a informação

        let data = {
            uid: uid,
            nome: userProfile.data().nome,
            email: value.user.email,
            avatarUrl: userProfile.data().avatarUrl,
        };

        setUser(data); // Se deu tudo certo vai passar para data
        storageUser(data);  // Salvar no localStorage
        setLoadingAuth(false);

        toast.success('Bem vindo de volta.');



    })
    .catch((error)=>{
        console.log(error);
        toast.error('Opss! Algo deu errado...');

        setLoadingAuth(false);

    })
}







//signed é um boolean para saber se está logado ou não.
// signed: !!user    isso converte para boolean
//tudo que quiser disponibilizar globalmente é só inserir aqui {signed: !!user, user, loading}
    return(
        <AuthContext.Provider value={{
            signed: !!user, 
            user, 
            loading, 
            signUp,
            signOut, //Ir em Dashboard importar useContext e AuthContext para criar o botão sair
            signIn, //Para fazer o login. Agora ir em pages/index.js
            loadingAuth, //Para avisar usuário que está carregando informações

            setUser, //Precisa acrescentar setUser em auth para alterar useSatate de USER
            storageUser, //Precisa acrescentar storageUser em auth para salvar no localStorage
            
            }}> {/*signUp pode ser disponibilizado aqui tb e precisa ser acessado na página do componente signUp*/}
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;