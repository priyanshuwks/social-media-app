import './Signup.scss';
import React from 'react'
import {Link} from 'react-router-dom'

function Signup() {
  return (
    <div className='Signup'>
        <div className="signupBox">
            <h2 className="heading">Sign Up</h2>
            
            <form action="">
            <label htmlFor="fullname">Full Name</label>
            <input type="text" className='fullName' id='fullname'/>

            <label htmlFor="email">Email</label>
            <input type="email" className='email' id='email'/>

            <label htmlFor="password">Password</label>
            <input type="text" className='password' id='password' />

            <input type="submit" className='submit' />
            </form>
            <p className='subHeading'>Already have an account? <Link to='/login'>Log In</Link></p>
        </div>
    </div>
  )
}

export default Signup