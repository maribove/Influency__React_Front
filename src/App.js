import './App.css';

// Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Hooks
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound/NotFound';
import Register from './pages/Auth/Register';
import EditProfile from './pages/EditProfile/EditProfile';
import Profile from './pages/Profile/Profile';
import Post from './pages/Post/Post';
import Search from './pages/Search/Search';
import Jobs from './pages/Jobs/Jobs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import PerfilUser from './pages/PerfilUser/PerfilUser';
import Suporte from './pages/Suporte/Suporte';
import ResetPassword from './pages/ResetPassword/ResetPassword';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Função para enviar email (se necessário)
const sendEmail = async (emailDestinatario, subject, text) => {
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: emailDestinatario,
                subject: subject,
                text: text,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar e-mail');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
    }
};

function App() {
    const { auth, loading } = useAuth();

    console.log(loading);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <div className='container'>
                    <Routes>
                        <Route path='/' element={auth ? <Home /> : <Navigate to="/login" />} />
                        <Route path='/profile' element={auth ? <EditProfile /> : <Navigate to="/login" />} />
                        <Route path='/users/:id' element={auth ? <Profile /> : <Navigate to="/login" />} />
                        <Route path='/suporte' element={auth ? <Suporte /> : <Navigate to="/login" />} />
                        <Route path='/:id/profile' element={auth ? <PerfilUser /> : <Navigate to="/login" />} />
                        <Route path='/login' element={!auth ? <Login /> : <Navigate to="/" />} />
                        <Route path='/register' element={!auth ? <Register /> : <Navigate to="/" />} />
                        <Route path='/search' element={auth ? <Search /> : <Navigate to="/login" />} />
                        <Route path='/posts/:id' element={auth ? <Post /> : <Navigate to="/login" />} />
                        <Route path='/jobs' element={auth ? <Jobs /> : <Navigate to="/login" />} />
                        <Route path='/forgotpassword' element={<ForgotPassword />} />
                        <Route path='/resetpassword' element={<ResetPassword />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
