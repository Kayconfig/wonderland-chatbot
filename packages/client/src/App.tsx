import './App.css';
import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
    const [msg, setMsg] = useState<string>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch('/api/hello')
            .then((res) => res.json())
            .then((data) => setMsg(data.message))
            .catch(() => setMsg('Unable to process request'))
            .finally(() => setLoading(false));
    });
    return (
        <>
            <p className="font-bold p-4 text-3xl">
                {loading ? 'loading...' : msg}
            </p>
            <Button>Click me</Button>
        </>
    );
}

export default App;
