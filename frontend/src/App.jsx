
import './App.css'
import axios from 'axios'



function App() {
  let first=10;
  axios.get("/api/raj")
  .then((res)=>{
    console.log(res.data.nums);
  })
  .catch((err)=>{
    console.log(err);
  })

    return (<>
      Hey Raj Parikh <h1>{first}</h1>
    </>)  
}

export default App
