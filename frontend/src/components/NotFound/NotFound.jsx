import React from 'react';
import { Link } from 'react-router-dom'; 
import notfound from '../../assets/notfound.png';


const NotFound = () => {
  return (
    <section>
      <div className='page notfound'>
        <img src={notfound} alt="not found" />
        <Link to={'/'}>RETURN TO HOME PAGE</Link>
      </div>
    </section>
  );
};

export default NotFound;
