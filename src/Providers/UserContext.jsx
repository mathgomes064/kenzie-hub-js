import { createContext, useEffect, useState } from "react"; 
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AuthContext = createContext({});

const AuthProvider = ({children}) =>{

    const [tech, setTech] = useState([])

    const [user, setUser] = useState({})

    const [token, setToken] = useState(JSON.parse(localStorage.getItem("@user-data:token")))
    
    const history = useHistory()
    
    function Logar(data){
        toast.promise(
            axios.post("https://kenziehub.herokuapp.com/sessions", data)
            .then((response) => {localStorage.setItem("@user-data:token", JSON.stringify(response.data.token)); setToken(response.data.token)})
            .then(() => history.push("/home")), {pending: "Logando...", success: "Logado com sucesso", error: "Email ou senha inválido"}
        )
    }
    
    function cadastrarTecnologia(data){
        setTech([data, ...tech])
        
        axios.post("https://kenziehub.herokuapp.com/users/techs", data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {atualizarUsuario(); toast.success("Tecnologia Cadastrada")})
        .catch((err) => console.log(err))
    }
    
    useEffect(atualizarUsuario, [])

    function atualizarUsuario(){
        axios.get("https://kenziehub.herokuapp.com/profile", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => { 
            setUser(response.data)
            history.push("/home")})
        .catch((err) => { history.push("/"); localStorage.clear()})
    }

    const onSubmitFunction = (data) => {
        console.log(data)
        toast.promise(
        axios.post("https://kenziehub.herokuapp.com/users", data)
        .then((response) => setTimeout(history.push("/"), 5000))
        .catch((err) => console.log(err)), {pending: "Cadastrando...", success: "Usuário cadastrado!", error: "Algo deu errado!"})
    }
    
    return(
        <AuthContext.Provider value={{
        Logar,
         user,
         cadastrarTecnologia,
         atualizarUsuario,
         token,
         onSubmitFunction}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;