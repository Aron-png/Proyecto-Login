import DefaultLayout from "../layout/DefaultLayout";
import { Navigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthProvider";
import './Styles/HomeStyles.css';

export default function Home() {    
    const auth = useAuth()
    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <>
            <DefaultLayout>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="boxes">
    <div className="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div className="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div className="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div className="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
      
    </div>
            
  
            </DefaultLayout>
        </>
    );
    
}

