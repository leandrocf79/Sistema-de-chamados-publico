import './new.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';

import firebase from '../../services/firebaseConnection';

//Funcionalidades, parte do cliente
import { useState, useEffect, useContext } from 'react';// useContext - vai precisar do id do user por isso importar
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

//Botão editar.  Importar rota para pegar o ID
import {useHistory, useParams} from 'react-router-dom';

export default function New(){
    //Botão editar.
    const { id }=useParams();
    const history = useHistory();
    const [idCustomer, setIdCustomer]=useState(false);

    const [assunto, setAssunto]=useState('Suporte');
    const [status, setStatus]=useState('Aberto');
    const [complemento, setComplemento]=useState('');

    //Funcionalidades, parte do cliente
    const {user} =useContext(AuthContext);
    const [customers, setCustomers]=useState([]);
    const [loadCustomers, setLoadCustomers]=useState(true);//Para exibir ao usuário que está buscando info no BD
    const [customerSelected, setCustomerSelected ]=useState(0);//Pegar o ID selecionado do cliente pois será tudo dinâmico
    useEffect(()=>{
        async function loadCustomers(){ // vai chamar "customers" no BD, verificar o nome correto que foi criado.
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                        cnpj: doc.data().cnpj,
                    })
                })
                //Fazer a verificação
                if(lista.length === 0){
                    console.log('Nenhuma empresa encontrada');
                    setCustomers([{ id:'1', nomeFantasia:'Nenhuma empresa encontrada'}]);//Caso erro, não pode ficar vazio, nesse caso vai ficar em "branco"
                    setLoadCustomers(false);//Volta para false
                    toast.error('Nenhuma empresa encontrada');
                    return;
                }//Se encontrou, passar a lista
                setCustomers(lista);
                setLoadCustomers(false);//Volta para false

//Botão editar, fazer verificação:
                if(id){
                    loadId(lista);
                }



                //Passar tuddo isso para o formulário em <select>
            })
            .catch((error=>{
                console.log(error);
                setLoadCustomers(false);//Volta para false
                setCustomers([{ id:'1', nomeFantasia:''}]);//Caso erro, não pode ficar vazio, nesse caso vai ficar em "branco"
                toast.error('Erro! Algo inesperado ocorreu.')
            }))
        }

        loadCustomers();

    },[id]);/*Botão editar, navegador solicitou isso, mas não precisa. 
    Caso queira tirar as mensagens pode colocar todo o loadId para dentro do 
    useEffect.
    Agora precisa acertar o Botão registrar em handleRegister, fazer a verificação
    para poder fazer o UPDATE */



//Botão editar, fazer verificação no BD:
    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot)=>{//Se chegou até aqui é pq achou o id no DB
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            //encontar index do cliente
            let index = lista.findIndex(item=>item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);//Vai confirmar a rota com o id do DB

        })//Foi devolvido do DB para a página new os dados selecionados em editar

        .catch((err)=>{
            console.log("Erro no ID passado.", err);
            setIdCustomer(false);//Ta dizendo que o ID não existe
        })
    }



    async function handleRegister(e){
        e.preventDefault();
        //alert('teste botão registrar')

        //Botão editar. Se idCustomer tiver true é pq está tentando editar
        if(idCustomer){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid,
            })
            .then(()=>{
                toast.success('Editado com sucesso.');
                setCustomerSelected(0);
                setComplemento('');
                history.push('/dashboard');//Após atualizar vai enviar para pg dashboard
            })
            .catch((err)=>{
                toast.error('Erro ao editar. Tente novamente mais tarde.');
                console.log('Erro ao editar:', err);
            })
            return; //Para sair aqui e não ir para baixo e cadastrar
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid,
        })/*Aula 117*/
        .then(()=>{
            toast.success('Registrado com sucesso.');
            setComplemento('');
            setCustomerSelected(0);

        })
        .catch((err)=>{
            console.log(err);
            toast.error('Erro! Erro ao registrar.')
        })
    }
    
    //Trocar assunto
    function handleChancheSelect(e){
        setAssunto(e.target.value);
        //console.log(e.target.value);
    }


    //Trocar status
    function handleOptionChanche(e){
       setStatus(e.target.value); 
       //console.log(e.target.value);
    }


//Trocar cliente na opção do chamado
async function handleChancheCustomers(e){
   // console.log('INDEX do cliente selecionado: ', e.target.value );
   // console.log('Cliente selecionado: ', customers[e.target.value])
    setCustomerSelected(e.target.value);    
}

    return(
        <div>
            <Header/>
            
            <div className='content'>
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile'   onSubmit={handleRegister} >
                        
                        <label>Cliente </label>
                        {loadCustomers ? (
                            <input type='text' disabled={true} value="Carregando clientes..." />
                        ):(


                        <select value={customerSelected} onChange={handleChancheCustomers}>
                            {customers.map((item, index)=>{
                                return(                                    
                                <option key={item.id} value={index}>
                                    {item.nomeFantasia}                                 
                                </option>                                                             
                                )                                
                            })}         
                                              
                        </select>
                        
                        )}
                        {/* Para exibir o CNPJ fora do select */}
                      {customerSelected !== 0 && <p><strong>CNPJ: </strong>{customers[customerSelected].cnpj}</p>}
                     

                        

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChancheSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita técnica">Visita técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status do chamado</label>
                        <div className='status'>
                            <input type='radio' name='radio' value="Aberto"
                            onChange={handleOptionChanche}
                            checked={status === 'Aberto'} 
                            /> <span>Aberto</span>  {/*    checked={status === 'Aberto'}  Compara qual está marcado inicialmente */}

                            <input type='radio' name='radio' value="Progresso"
                            onChange={handleOptionChanche}
                            checked={status === 'Progresso'}
                            /> <span>Progresso</span>

                            <input type='radio' name='radio' value="Finalizado"
                            onChange={handleOptionChanche}
                            checked={status === 'Finalizado'}
                            /> <span>Finalizado</span>
                        </div>

                        <label>Solicitação</label>
                        <textarea type="text"  placeholder='Descreva...' 
                        value={complemento}
                        onChange={(e)=> setComplemento(e.target.value)}
                        />

                        <button type='submit'>Registrar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}