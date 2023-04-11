import './header.css';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom';

/*   Veja: https://react-icons.github.io/react-icons/
                     Instalar: npm install react-icons */
import { FiHome, FiUser, FiSettings  } from "react-icons/fi"; //Nomes dos icones                     


export default function Header(){
    const { user } = useContext(AuthContext);



    return(
        <div className="sidebar">
            {/*Pode exibir o que quiser de 'user' aqui. Exemplo:
            <span> Header: {user.email} </span>*/}

            <div>  {/*Atenção aqui!! Por algum motivo está invertido. null deveria ser verdadeiro o avatar.
            REINICIEI o notebook e está funcionando normalmente agora, vai entender rsrs
            O correto é:   (=== null ? avatar : user.avatarUrl)*/}

                <img src={ user?.avatarUrl === null ? avatar : user.avatarUrl  } alt="Foto avatar"/>
               
            </div>   

{/*   Veja: https://react-icons.github.io/react-icons/
                     Instalar: npm install react-icons */}
            <Link to='/dashboard'> 
                <FiHome color='#fff' size={25} />
            Chamados           
            </Link>   


            <Link to='/customers'> 
                <FiUser color='#fff' size={25} />
            Clientes            
            </Link>    


            <Link to='/profile'> 
                <FiSettings color='#fff' size={25} />
            Configurações            
            </Link>     

        </div>
    )
}