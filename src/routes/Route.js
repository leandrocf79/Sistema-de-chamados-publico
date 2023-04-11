
import { useContext } from 'react';

// Redirect - para enviar o usuário para uma página específica
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../contexts/auth';



// isPrivate - para saber se a rota é privada ou não
// usando o sprad operator(...) vai passar todo o resto aqui

export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}){
    const{signed, loading}=useContext(AuthContext);


    //const loadin = false;

        

    //Condicionais de verificação de login
    if(loading){
        return(
            <div></div>
        )        
    }

    //Se não está logado e rota que está tentando acessar for privada será direcionado para login
    if( !signed && isPrivate){
        return <Redirect to='/' />
    }

    //Logado e acessa página não privada
    if( signed && !isPrivate){
        return <Redirect to='/dashboard' />
    }
    
    
    return(
        <Route
            {...rest}
            render={props => (
                <Component{...props} />
                )} //Para retornar o componente com todas as propriedades
        />
    )
}