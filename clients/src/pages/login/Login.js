import React, { useState } from 'react'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStorageManager';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  async function handleSubmit(e){
    e.preventDefault();

    try{
      const result = await axiosClient.post('http://localhost:4000/auth/login', {
      email,
      password
    })
    console.log(result);
    setItem(KEY_ACCESS_TOKEN, result.accessToken);
    navigate('/');
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className='Login'>
        <div className="login-box">
            <h2 className="heading">Login</h2>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" className='email' id='email' onChange={(e) => setEmail(e.target.value)}/>

                <label htmlFor="password">Password</label>
                <input type="password" className='password' id='password' onChange={(e) => {
                  setPassword(e.target.value);
                  console.log(password);
                }}/>

                <input type="submit" className='submit' onSubmit={handleSubmit}/>
            </form>
            <p className='subHeading'>Do not have an account? <Link to='/signup'>SignUp</Link></p>
        </div>
    </div>
  )
}

export default Login