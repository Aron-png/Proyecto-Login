
/*
En éste archivo se tendra:
    - el header, encabezado de la página web.
    - el contenido del children.
 */

    import { useNavigate } from 'react-router-dom';
    import React from 'react';
    import './Styles/DefaultStyles.css';
    
    interface DefaultLayoutProps {
        children: React.ReactNode;
    }
    
    export default function DefaultLayout({ children }: DefaultLayoutProps) {
        const goto = useNavigate(); // Mover la llamada a useNavigate aquí dentro
    
        return (
            <>
                <header>
                <div className="centradoOne">
    <div className="radio-wrapper" onClick={() => goto("/login")}>
        <input type="radio" id="value-1" name="btn" className="input" />
        <div className="btn letraNormal">
            <span className="no-underline" aria-hidden={false}>Login</span>
            <span aria-hidden={false} className="btn__glitch">_L_o_g_i_n_</span>
            <label className="number">R1</label>
        </div>
    </div>

    <div className="radio-wrapper" onClick={() => goto("/")}>
        <input type="radio" defaultChecked id="value-2" name="btn" className="input" />
        <div className="btn letraNormal">
            <span aria-hidden={false}>Home</span>
            <span aria-hidden={false} className="btn__glitch">$h0 me</span>
            <label className="number">R2</label>
        </div>
    </div>

    <div className="radio-wrapper" onClick={() => goto("/signup")}>
        <input type="radio" id="value-3" name="btn" className="input" />
        <div className="btn letraNormal">
            <span aria-hidden={false}>Sign up</span>
            <span aria-hidden={false} className="btn__glitch">sI_Gn #p</span>
            <label className="number">R3</label>
        </div>
    </div>
</div>
                </header>
    
                

                <main>{children}</main>
            </>
        )
    }
    