import React, { useEffect, useState } from 'react';
import axios from "axios"
import Add from './Add';
import Card from "./Card"

interface Quiz{
  word: string,
  name: string,
  time: string,
  article: string
}

const initial = [
  {time: "3/20/2020", name:"Nao", article:"der", word: "Wind"},
  {time: "3/20/2020", name:"Nao", article:"die", word: "Sonne"},
  {time: "3/20/2020", name:"Nao", article:"der", word: "Hand"},
]


const App:React.FC = () => {
  const [list, setList] = useState(initial)
  const [quiz, setQuiz] = useState<Quiz>(initial[0])
  const [fail, setFail] = useState(false)


  useEffect(()=>{
    axios.get("https://api.motimanager.com/artikle/")
    .then(res => setList(res.data.list))
    .catch(()=> setFail(true))
  },[])

  const nextCard = () =>{
    let random:number = Math.floor(Math.random() * list.length)
    while (quiz.article === list[random].article){
      random = Math.floor(Math.random() * list.length)
    }
    setQuiz(list[random])
  }

  const update = (newWord: { time: string; name: string; article: string; word: string; }) => {
    setList([newWord, ...list])
  }

  return (
    <div>
      <div style={{backgroundColor:"rgba(255,255,255,0.3)"}}>
        <div style={{maxWidth:"1000px", margin:"0 auto", padding:"15px"}}>
          <h1 style={{margin:0}}>ARTIKLE</h1>
          <h3>Globally Shared Flashcards</h3>
        </div>
      </div>
      <div style={{textAlign:"center", maxWidth:"800px",margin:"0 auto",  padding:"20px"}}>
        <Card quiz={quiz} nextCard={nextCard} />
        <p/>
        <p/>
        <Add update={update} />
        <div style={{height:"100px"}} />
        <div style={{ backgroundColor:"rgb(70,70,70)", color:"white", borderRadius:"20px", maxHeight:"400px", overflow:"auto", padding:"20px" }}>
          <h2 style={{ fontWeight:"normal" }}>{list.length} words were added by users!</h2>
          {fail?
            <h3 style={{ margin: 0, padding:"5px", fontWeight: "normal" }}>
              *Server didn't respond, you don't have access to all the words.
            </h3>
          :null}
          <p/>
          <ul style={{textAlign:"left", maxWidth:"300px", margin:"0 auto"}}>
          {list.map((card, key)=>{
            return(
              <li key={key} style={{fontSize:"17px"}}>{card.name} added <strong style={{textDecoration:"underline",fontWeight:"normal"}}>
                {card.article} {card.word}</strong> - {card.time}
              </li>
            )
          })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
