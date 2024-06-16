import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock } from "react-icons/fa";
import api from '../../config/axiosCg';
import './LoginForm.css';

const LoginForm = () => {

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    
    const [ backData, setBackData ] = useState();
    const [ login, setLogin ] = useState();

    const navigate = useNavigate()

    useEffect(() => {
        const transfData = async () => {
            try {
                const dataExp = await api.get('/api/test/get')
                setBackData(dataExp.data)
            } catch (err) {
                console.error("gagal mendapatkan data ", err)
            }
        }

        transfData()
    }, [])

    const loginSub = async (e) => {
        try {
            e.preventDefault()
            const response = await api.post("/api/login", {
                username,
                password
            })
            setLogin(response.data)
            if (login) navigate('/dashboard')
        } catch (err) {
            setLogin(err.response.data)
        }
    }

  return (
      <div className='wrapper'>
        <div>
            <p>{login}</p>
        </div>
        <form onSubmit={loginSub}>
            <h1>Mine Login</h1>
            <div className='input-box'>
                <input type='text' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <FaUser className='icon'/>
            </div>
            <div className='input-box'>
                <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <FaLock className='icon'/>
            </div>
            <div className='remember-forgot'>
                <label> <input type='checkbox' />remember me</label>
                <a href="#">forgot password</a>
            </div>
            
            <button type='submit'>Login</button>

            <div className='loginter-link'>
                <p>nggak punya akun, nih <a href="/registrasi">daftar</a></p>
            </div>
            <div className='backend-stat'>
                {backData ? <p>{backData}</p> : <p>core: disconnect</p>}
            </div>
        </form>
    </div>
  )
}

export default LoginForm;
