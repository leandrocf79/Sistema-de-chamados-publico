import './modal.css';
import { FiX } from 'react-icons/fi';


export default function Modal({conteudo, close}){
    return(
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={ close }>
                    <FiX size={23} color='#fff'/>
                </button>

                <div>
                    <h2>Detalhes do chamado:</h2>
                    <div className='row'>
                        <span>
                            <strong>Cliente:</strong> <i>{conteudo.cliente}</i>
                        </span>
                    </div>


                    <div className='row'>
                        <span>
                        <strong>Assunto:</strong> <i>{conteudo.assunto}</i>
                        </span>
                        <span>
                        <strong>Cadastrado em:</strong><i>{conteudo.createdFormated}</i>
                        </span>
                    </div>


                    <div className='row'>
                        <span>
                        <strong> Status:</strong> <i style={{color:'#fff', backgroundColor: conteudo.status==='Aberto' ? '#ff0000' : 
                                                                conteudo.status==='Progresso' ? '#5cb85c' : 
                                                                conteudo.status==='Finalizado' ? '#999' : ''
                                    }}>{conteudo.status}</i>
                        </span>
                    </div>

                    {/*Neste projeto o complemento ficou como opcional, mas no projeto real deve ser obrigatório */}
                    {conteudo.complemento !== '' && (
                        <>
                        <h3>Complemento</h3>
                        <p>{conteudo.complemento}</p>
                        </>
                    )}


                </div>
            </div>
        </div>
    )
}
