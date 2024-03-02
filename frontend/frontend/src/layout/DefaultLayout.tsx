import { Link } from 'react-router-dom';
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
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup">Sign up</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
        </>
    )
}