import './dashboard.css';
// Importar useContext e AuthContext para poder deslogar
//useEffect para fazer BUSCAS por chamados no DB
import { useState, useEffect } from "react";
import firebase from '../../services/firebaseConnection';


import  Header  from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

//Para formatar data instalar. Veja a documentação em https://date-fns.org/
  import {format} from 'date-fns';  
  
  //botões buscar e editar. Importar Modal
  import Modal from '../../components/Modal';



//useEffect para fazer BUSCAS por chamados no DB
const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');



export default function Dashboard(){

    //Para simular um chamado durante o desenvolvimento coloque 1, 
    //mas para o uso normal, deixar em branco, inicia vazia.
    const [chamados, setChamados]=useState([]);// Será em um array pois terá uma lista.

//useEffect para fazer BUSCAS por chamados no DB
    const [loading, setLoading]=useState(true);//Carregando chamado
    //buscar mais
    const [loadingMore, setLoadingMore]=useState(false);
    //para saber se a lista está vazia
    const [isEmpty, setIsEmpty]=useState(false);
    //Pega o último documento buscado
    const [lastDocs, setLastDocs]=useState();

     //botões buscar e editar. //Buscar
    const [showPostModal, setShowPostModal]=useState(false);
    const [detail, setDetail] = useState();//Detalhes do conteúdo


    useEffect(()=> {

//A função loadChamados() pode ser passada aqui para tirar aviso no console do navegador, mas não tem problema deixar assim.

        loadChamados();    
        return () => {    
        }
      }, []);

    //Criando aqui fora o loadChamados poderá ser chamada em qualquer lugar a aplicação, mas pode ser passada dentro de useEffect
    async function loadChamados(){
        await listRef.limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
        .catch((err)=>{
            console.log('Erro ao buscar', err);
            toast.error("Algo saiu errado.")
            setLoadingMore(false);
        })
        setLoading(false);
    }

   async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size===0;
        //se for diferente de vazia
        if(!isCollectionEmpty){
            let lista=[];

            snapshot.forEach((doc)=>{
                lista.push({ //Veja a lista criada no DB
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    //Para formatar data instalar date-fns no terminal. Veja a documentação em https://date-fns.org/
                    //npm install date-fns    import {format} from 'date-fns';  
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                    

                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length -1]; //Pega o último documento buscado
            
            setChamados(chamados=>[...chamados, ...lista]);
            setLastDocs(lastDoc);
        }else{
            setIsEmpty(true);
        }
        setLoadingMore(false);
   }


   //botão de busca
   async function handleMore(){
    setLoadingMore(true);
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshot)=>{
      updateState(snapshot);
    })
  }




 //  Passar os itens buscados para Dashboard
 if(loading){
    return(
        <div>
            <Header/>

            <div className='content'>  
                <Title name='Atendimentos'>
                    <FiMessageSquare size={25}/>                    
                </Title>
            </div>

            <div className='container dashboard'>
                <span>Buscando chamados...</span>
            </div>
        </div>
    )
 }



 //botões buscar e editar.
 //Buscar.  A ideia toogle é que sempre que tiver aberto, fecha e vice versa.
 async function tooglePostModal(item){
    //console.log(item);
    setShowPostModal(!showPostModal); //Vai inverter true/false
    setDetail(item);
 }


 
    return(
        <div>
            <Header/>

            <div className='content'>  
                <Title name='Atendimentos'>
                    <FiMessageSquare size={25}/>                    
                </Title>


{/*Se for igual a zero quer dizer que não há chamados */}
                { chamados.length===0 ? (  
                    <div className='container dashboard'>
                        <span>Verificando... Nenhum chamado registrado.</span>

                        <Link  to='/new' className='new' >
                            <FiPlus color='fff' size={25} />
                            Novo chamado
                        </Link>
                    </div>

                ) : (
                    
                   <>   {/*Pode usar um "Fragment" aqui para não alterar formatação */}

                        <Link  to='/new' className='new' >
                            <FiPlus color='fff' size={25} />
                            Novo chamado
                        </Link> 


                        {/*Tabelas dos chamados */}
                        <table>
                            <thead>{/*Cabeçalho */}
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado em</th>
                                    <th scope='col'>#</th>                                    
                                </tr>                                
                            </thead>

                            <tbody>
                                {/* Passar os itens buscados para Dashboard
                                Essa parte toda tem que ser dinâmica, passar tr todo para dentro de .map() */}

                                {chamados.map((item, index)=>{
                                    return( //Agora é só distribuir todos os dados da lista aqui


                                        <tr key={index}>
                                            <td data-label='Cliente'>{item.cliente}</td>
                                            <td data-label='Assunto'>{item.assunto}</td>
                                            <td data-label='Status'>
                                            <span className='badge' style={{ 
                                               backgroundColor: item.status==='Aberto' ? '#ff0000' : 
                                                                item.status==='Progresso' ? '#5cb85c' : 
                                                                item.status==='Finalizado' ? '#999' : ''
                                            }} >{item.status}</span>

                                            </td>
                                            <td data-label='Cadastrado'>{item.createdFormated}</td>

                                            <td data-label='#'>
                                            <button className='action' style={{backgroundColor:'#3583f6'  }} 
                                            onClick={()=> tooglePostModal(item)}>
                                                <FiSearch color='#fff' size={17} />
                                            </button>
                                            <Link className='action' style={{backgroundColor:'#f6a935'  }} to={`/new/${item.id}`}>
                                                <FiEdit2 color='#fff' size={17} />
                                            </Link >
                                            
                                            </td>
                                        </tr>

                                    )
                                })}
                                
                            </tbody>
                        </table>   

                         {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
            { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button> } 
            
                   
                   </>

                   
                )} 

<div className="nav-link">
    <a href="https://www.linkedin.com/in/leandrocf79-80b93b199/" target="_blank" >
        <p>leandrocf79@gmail.com <br></br>Analista e Desenvolvedor de Sistemas</p>
    </a>
</div>  

            </div>     

            {/*//botões buscar e editar. Importar Modal*/}
            {showPostModal && (
                <Modal
                    conteudo={detail} close={tooglePostModal}
                />
            )}


        </div>
        
    )
}