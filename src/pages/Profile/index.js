// Para editar informações de usuário deve importar:
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import avatar from  '../../assets/avatar.png';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';

/*Parte funcional de edição. */
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';


export default function Profile(){

// Para editar informações de usuário
//setUser, //Precisa acrescentar setUser em auth para alterar useSatate de USER
//storageUser, //Precisa acrescentar storageUser em auth para salvar no localStorage
const { user, signOut, setUser,  storageUser} = useContext(AuthContext);

const [nome, setNome] = useState(user && user.nome); //Não logou em branco, deve passar os parâmetros do acesso do usuário.
const [email, setEmail] = useState(user && user.email);
const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

// Para editar ARQUIVOS de usuário
/*Parte funcional de edição. 
Enviar imagem para useState separada*/
const [imageAvatar, setImageAvatar] = useState(null);


// Para editar ARQUIVOS de usuário
function handleFile(e){
    //console.log(e.target.files[0]);// Ver em inspecionar

    if (e.target.files[0]){ //Se tem imagem vai parrar para image
        const image = e.target.files[0];

        //Selecionar tipos de arquivos. Criar um if encapsulado no if
        if(image.type === 'image/jpeg' || image.type === 'image/png')
        setImageAvatar(image); //Recebe image

        //Preview
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }else{
        alert('Envie imagem nos formatos JPEG ou PNG.');
        setImageAvatar(null);
        return null; //Parar a execução do cod
    }
}


// Para editar ARQUIVOS de usuário. Aqui vai enviar para o Db Firebase
async function handleUpload(){
    const currentUid = user.uid; //Para saber qual usuário está logado

    //.ref(`image/${currentUid}/${imageAvatar.name}`) vai criar subdiretórios para armazenar a imagem no Firestorage
    const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async ()=>{
            console.log("Imagem enviada com sucesso.");
            

            //Atualizar null no firestore com o nome da imagem
            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url)=>{
                let urlFoto = url;

            //Agora é só enviar. Se alterou nome tb será enviado
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                avatarUrl: urlFoto,
                nome: nome
            })
            //Se deu tudo certo.
            .then(()=>{
                let data = {
                    ...user,
                    avatarUrl: urlFoto,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
                toast.success("Alteração realizada com sucesso!")

            })
            })
        })

}



/*Parte funcional de edição. */
async function handleSave(e){
    e.preventDefault();
    //alert('teste botão salvar')

    if(imageAvatar === null && nome !== ''){
        await firebase.firestore().collection('users')
        .doc(user.uid)
        .update({
            nome: nome
        })
        .then(()=>{
            //setUser, //Precisa acrescentar setUser em auth para alterar useSatate de USER
            //storageUser, //Precisa acrescentar storageUser em auth para salvar no localStorage
            let data = {
                ...user, // tudo que tiver em user, mas neste caso só o nome
                nome: nome                
            };
            //Para atualizar
            setUser(data);
            storageUser(data);
            
        })
    }
    // Para editar ARQUIVOS de usuário
    else if(nome !=='' && imageAvatar !== null){
        //Criar uma função
        handleUpload();        
    }

    toast.success("Alteração realizada com sucesso!")
}


    return (
        <div>
            <Header/>
            <div className='content'>
                <Title name ="Meu Perfil" >
                    <FiSettings  size={25} />
                </Title>


        {/*// Para editar informações de usuário */}
                <div className='container'>

                    {/*Parte funcional de edição. Adicionar onSubmit*/}
                    <form className='form-profile' onSubmit={handleSave}>
                        
                        <label className='label-avatar'> 
                        {/* criar um ícone sobre a imagem do avatar*/}
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>

        {/* // Para editar ARQUIVOS de usuário
        A função onChange={handleFile} é para criar uma preview */}
                            <input type='file' accept='  image/*  ' onChange={handleFile} />  {/* Na edição de img vai aceitar somente imagens*/}
                            
                            <br/> 
                            {/* Caso não tenha imagem deverá exibir o avatar padrão*/}
                            { avatarUrl === null ? 
                                <img src={avatar} width="200" height='200' alt='Imagem do perfil do usuário' /> 
                                : 
                                <img src={avatarUrl} width="200" height='200' alt='Imagem do perfil do usuário' />
                            }
                        </label>


                        <label>Nome</label>
                        <input type='text' value={ nome } onChange={ (e)=> setNome(e.target.value)}/>


                        <label>E-mail</label>
                        <input type='text' value={ email } disabled={true}/> {/* Tirar o onChange para não trocar o email*/}

                        <button type='submit'>Salvar</button>
                    </form>
                </div>

{/* Criar um campo novo fora de form pra sair, mas pode usar as mesmas configurações de container*/}
                <div className='container'>
                    <button className='logout-btn' onClick={ ()=> signOut() } >
                        Sair
                    </button>
                </div>


            </div>
        </div>
    )
}

// testar http://localhost:3000/profile

/* <Title></Title>  foi passado dessa forma para poder receber de children.
Cada tela ele terá um icone diferente, vai ser melhor assim

*/