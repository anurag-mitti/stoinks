
import { useState } from "react"
function App() {

  const[message, setMessage]=useState('did not get anythying yet')

  
  const ws=new  WebSocket('ws://localhost:8000')
  ws.onopen=function(event){
    ws.send("hi from client")
  }

  ws.onmessage= function(event)
  {
    console.log(event.data)
    setMessage(event.data)
  }
  

  return (
    <> 
    {message}
     
    </>
  )
}

export default App
