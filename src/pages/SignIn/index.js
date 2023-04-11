
//Para logar importar useContext e AuthContext

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import './signin.css';
import logo from '../../assets/logoJPG.jpg';

function SignIn() {
  const [email, setEmail] =useState('');
  const [password, setPassword] =useState('');

  //Para logar importar useContext e AuthContext e fazer uma verificação
  const { signIn, loadingAuth } = useContext(AuthContext);


  async function handleSubmit(e){
    e.preventDefault(); //Para não atualizar a página
    //alert('teste handleSubmit')

//Para logar importar useContext e AuthContext e fazer uma verificação
    if(email !== '' &&  password !== ''){
     //Se for diferente de vazio, então vai chamar signIn
      signIn(email, password);
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
              <h1>Entrar</h1>
              <input type="text" placeholder='E-mail' value={email} onChange={(e)=> setEmail(e.target.value) }/>
              <input type="password" placeholder='************'value={password} onChange={(e)=> setPassword(e.target.value) }/>
              <button type='submit'>{loadingAuth?'Carregando...' : 'Entrar'} </button>
            </form>
            <Link to='/register'>Criar uma conta.</Link>

        </div>        
      </div>
    
    );
  }
  
  export default SignIn;