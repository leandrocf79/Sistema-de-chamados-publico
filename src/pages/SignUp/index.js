import { useState, useContext } from 'react'; //importar useContext
import { AuthContext } from '../../contexts/auth';//importar useContext

import { Link } from 'react-router-dom';
import logo from '../../assets/logoJPG.jpg';

function SignUp() {
  
  const [email, setEmail] =useState('');
  const [password, setPassword] =useState('');
  const [nome, setNome] =useState('');

  //importar useContext e chamar signUp
  const { signUp, loadingAuth } = useContext(AuthContext); //importar useContext

  
  async function handleSubmit(e){
    e.preventDefault(); //Para não atualizar a página
    //alert('teste handleSubmit')

//importar useContext aqui com signUp. Se tudo for DIFERENTE  de vazio, cadastrar usuário.
    if( email !== ''  &&  password !== '' && nome !== ''){
      signUp( email, password, nome ) //Tem que ser NA MESMA ORDEM DECLARADA que está em auth.js

    }

  }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='logo-area'>
            <div> 
            <img src={logo} alt='Logo marca' />
            </div>
          </div>
          

            <form onSubmit={handleSubmit}>
              <h1>Cadastro</h1>

              <input type="text" placeholder='Digite seu nome' value={nome} onChange={(e)=> setNome(e.target.value) }/>


              <input type="text" placeholder='E-mail' value={email} onChange={(e)=> setEmail(e.target.value) }/>
              <input type="password" placeholder='************'value={password} onChange={(e)=> setPassword(e.target.value) }/>
             
              <button type='submit'>{loadingAuth?'Carregando...' : 'Cadastrar'} </button>
            </form>


            <Link to='/'>Já possui uma conta? Entrar.</Link>


        </div>        
      </div>
    
    );
  }
  
  export default SignUp;

  //http://localhost:3000/register