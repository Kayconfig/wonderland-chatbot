import './App.css';
import { useEffect, useState } from 'react';

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
      <h1>{loading ? 'loading...' : msg}</h1>
    </>
  );
}

export default App;
