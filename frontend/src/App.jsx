
import './App.css'
import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  let first=10;
  const [number, setNumber] = useState(null);
  useEffect(() => {
    axios.get("/api/raj")
      .then((res) => {
        setNumber(res.data.nums);
        console.log(res.data.nums);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

    return (<>
    Hey Raj Parikh <h1>{number !== null ? number : 'Loading...'}</h1>    </>)  
}

export default App
