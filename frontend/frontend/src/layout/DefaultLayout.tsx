import { Link } from 'react-router-dom';
import React from 'react';
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
            
            <main>{children}</main>
        </>
    )
}