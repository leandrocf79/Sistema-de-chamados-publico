import { useState } from 'react';

/*Pode utilizar as mesmas configurações CSS que já foram feitas em profile.
Para isso basta utilizar os memos nomes das classes. */
import './customers.css';

import Title from '../../components/Title';
import Header from '../../components/Header';

import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

import firebase from '../../services/firebaseConnection';

export default function Customers(){
    const[nomeFantasia, setNomeFantasia] = useState('');
    const[cnpj, setCnpj] = useState('');
    const[endereco, setEndereco] = useState('');


    async function handleAdd(e){
        e.preventDefault();
       // alert('Teste Cadastrar no formulário')
       if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
        await firebase.firestore().collection('customers')
        .add({
            nomeFantasia: nomeFantasia,
            cnpj: cnpj,
            endereco: endereco
        })
        //Se deu tudo certo limpar dasdos do formulário
        .then(()=>{
            setNomeFantasia('');
            setCnpj('');
            setEndereco('');
            toast.success('Empresa cadsatrada com sucesso.')
        })
        //Se deu algun erro
        .catch((error)=>{
            console.log(error);
            toast.error('Erro ao cadastar empresa');
        })
       }else{
        toast.error('Preencha todos os campos.')
       }

    }



    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Clientes'>
                    <FiUser size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile customers' onSubmit={ handleAdd }>
                        <label>Nome da empresa</label>
                        <input type='text' placeholder='Nome da empresa' value={ nomeFantasia } 
                        onChange={(e)=>setNomeFantasia(e.target.value)} />

                        <label>CNPJ</label>
                        {/* Original do curso:
                        <input type='text' placeholder='CNPJ' value={ cnpj } 
                            onChange={ (e)=>setCnpj(e.target.value) } /> */}

                        <input type='text' placeholder='CNPJ' value={cnpj}  maxLength={18}
                            onChange={(e) => {
                                // Remove qualquer caractere que não seja número
                                let inputValue = e.target.value.replace(/\D/g, '');

                                // Formata o CNPJ
                                inputValue = inputValue.replace(/^(\d{2})(\d)/, '$1.$2');
                                inputValue = inputValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                inputValue = inputValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                                inputValue = inputValue.replace(/(\d{4})(\d)/, '$1-$2');

                                // Atualiza o estado com o CNPJ formatado
                                setCnpj(inputValue);
                            }}
                        />



                        <label>Endereço</label>
                        <input type='text' placeholder='Endereço' value={ endereco } 
                        onChange={(e)=>setEndereco(e.target.value)} />

                        <button type='submit'>Cadastrar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}


{/* No futuro pode usar a verificação do CNPJ  se existe:





import React, { useState } from 'react';
import cn from 'cnpj';
import InputMask from 'react-input-mask';

function CNPJInput() {
  const [cnpj, setCNPJ] = useState('');

  const handleCNPJChange = (event) => {
    const inputCNPJ = event.target.value;

    // Remove caracteres inválidos
    const formattedCNPJ = inputCNPJ.replace(/[^\d./-]/g, '');

    // Valida o CNPJ
    if (cn.isValid(formattedCNPJ)) {
      setCNPJ(formattedCNPJ);
    }
  };

  return (
    <InputMask
      mask="99.999.999/9999-99"
      placeholder="CNPJ"
      value={cnpj}
      onChange={handleCNPJChange}
    />
  );
}



*/}

{/* o código completo com verificação do CNPJ fica assim:


import { useState } from 'react';
import './customers.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import firebase from '../../services/firebaseConnection';

export default function Customers() {
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
      await firebase
        .firestore()
        .collection('customers')
        .add({
          nomeFantasia: nomeFantasia,
          cnpj: cnpj,
          endereco: endereco,
        })
        .then(() => {
          setNomeFantasia('');
          setCnpj('');
          setEndereco('');
          toast.success('Empresa cadastrada com sucesso.');
        })
        .catch((error) => {
          console.log(error);
          toast.error('Erro ao cadastrar empresa.');
        });
    } else {
      toast.error('Preencha todos os campos.');
    }
  }

  return (
    <div>
      <Header />
      <div className='content'>
        <Title name='Clientes'>
          <FiUser size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile customers' onSubmit={handleAdd}>
            <label>Nome da empresa</label>
            <input
              type='text'
              placeholder='Nome da empresa'
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
            />

            <label>CNPJ</label>
            <input
              type='text'
              placeholder='CNPJ'
              value={cnpj}
              maxLength={18}
              onChange={(e) => {
                let inputValue = e.target.value.replace(/\D/g, '');
                inputValue = inputValue.replace(/^(\d{2})(\d)/, '$1.$2');
                inputValue = inputValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                inputValue = inputValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                inputValue = inputValue.replace(/(\d{4})(\d)/, '$1-$2');
                setCnpj(inputValue);
              }}
            />

            <label>Endereço</label>
            <input
              type='text'
              placeholder='Endereço'
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <button type='submit'>Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}








*/}