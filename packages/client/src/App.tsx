import './App.css';
import { useEffect, useState } from 'react';
import ChatBot from './components/chat/ChatBot';
import { ToastContainer, Bounce } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import LoginPage from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './providers/auth-provider';

function App() {
    const [msg, setMsg] = useState<string>();
    const [loading, setLoading] = useState(false);

    return (
        <div className="h-screen w-screen">
            <AuthProvider>
                <Routes>
                    <Route index element={<LoginPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<Register />} />
                    {/* routes that require authentication */}
                    <Route path="chatbot" element={<ChatBot />} />
                </Routes>
            </AuthProvider>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}

export default App;
