import React, { useEffect, useState } from 'react';
import axios from "axios"

interface State { time: string, name: string, article: string, word: string }[]

const App:React.FC = () => {
  // useEffect(()=>{
  //   axios.get("https://api.motimanager.com/artikle")
  //   .then(data => console.log(data))
  //   .catch(()=>setList([...list, {time: "3/20/2020", name:"Nao", article:"der", word: "Wind"}])
  // },[])

  return (
    <div>
    </div>
  );
}

export default App;
