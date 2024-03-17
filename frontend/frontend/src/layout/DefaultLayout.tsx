import { Link } from 'react-router-dom';
import React from 'react';
import './Styles/DefaultStyles.css';
/*
En éste archivo se tendra:
    - el header, encabezado de la página web.
    - el contenido del children.
 */

interface DefaultLayoutProps{
    children: React.ReactNode;
}


export default function DefaultLayout({children} : DefaultLayoutProps){
    return(
        <>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/" className="no-underline">Home</Link>
                        </li>
                        <li>
                            <Link to="/login" className="no-underline">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup" className="no-underline">Sign up</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            
    <div className="centradoOne">

      <div className="radio-wrapper">
        <input type="radio" id="value-1" name="btn" className="input" />
        <div className="btn">
            <Link to="/login" className="no-underline"></Link>
          <span aria-hidden={false}>Home</span>
          <span aria-hidden={false} className="btn__glitch">$h0 me</span>
          <label className="number">R1</label>
          
        </div>
      </div>

      <div className="radio-wrapper">
        <input type="radio" defaultChecked id="value-2" name="btn" className="input" />
        <div className="btn">
        <Link to="/login" className="no-underline">
          <span aria-hidden={false}>Login</span>
          <span aria-hidden={false} className="btn__glitch">_L_o_g_i_n_</span>
          <label className="number">R2</label>
          </Link>
        </div>
      </div>

      <div className="radio-wrapper">
        <input type="radio" id="value-3" name="btn" className="input" />
        <div className="btn">
        <Link to="/login" className="no-underline">
        <span aria-hidden={false}>Sign up</span>
          <span aria-hidden={false} className="btn__glitch">sI_Gn #p</span>
          <label className="number">R3</label>
          </Link>
        </div> 
      </div>

    </div>

            <main>{children}</main>
        </>
    )
}