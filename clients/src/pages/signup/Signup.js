import './Signup.scss';
import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    const result = await axiosClient.post('http://localhost:4000/auth/signup', {
      name,
      email,
      password
    })
    console.log(result);
  }
  return (
    <div className='Signup'>
        <div className="signupBox">
            <h2 className="heading">Sign Up</h2>
            
            <form action="" onSubmit={handleSubmit}>
            <label htmlFor="fullname">Full Name</label>
            <input type="text" className='fullName' id='fullname' onChange={(e) => setName(e.target.value)}/>

            <label htmlFor="email">Email</label>
            <input type="email" className='email' id='email' onChange={(e) => setEmail(e.target.value)}/>

            <label htmlFor="password">Password</label>
            <input type="text" className='password' id='password' onChange={(e) => setPassword(e.target.value)}/>

            <input type="submit" className='submit' onSubmit={handleSubmit}/>
            </form>
            <p className='subHeading'>Already have an account? <Link to='/login'>Log In</Link></p>
        </div>
    </div>
  )
}

export default Signup