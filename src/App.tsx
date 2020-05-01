import React, { useEffect, useState } from 'react';
import axios from "axios"
import Add from './Add';
import Card from "./Card"
import { animated, useSpring } from "react-spring"

interface Quiz{
  word: string,
  name: string,
  time: string,
  article: string,
  definition: string
}

const initial = [
  {time: "3/20/2020", name:"Nao", article:"der", word: "Wind", definition: "wind"},
  {time: "3/20/2020", name:"Nao", article:"die", word: "Sonne", definition: "sun"},
  {time: "3/20/2020", name:"Nao", article:"die", word: "Hand", definition: "hand"},
  {time: "3/20/2020", name:"Nao", article:"das", word: "Bett", definition: "bed"},
  {time: "3/20/2020", name:"Nao", article:"die", word: "Katze", definition: "cat"},
]

let initialNum:number = Math.floor(Math.random() * initial.length)

const navArray = ["Article", "Spelling", "My Card"]


const App:React.FC = () => {
  const [list, setList] = useState(initial)
  const [quiz, setQuiz] = useState<Quiz>(initial[initialNum])
  const [fail, setFail] = useState(false)
  const [consent, setConsent] = useState(false)
  const [nav, setNav] = useState<string>(navArray[0])

  const fade = useSpring({
    opacity: consent? 0 : 1,
    bottom: consent? -10 : 0,
    position: "fixed",
    width: "100%",
    background: "rgb(255,255,255,0.9)",
    textAlign:"center",
    padding: "15px 5px",
    zIndex: 1,
    borderTop: "solid 1px black"
  })

  useEffect(()=>{
    axios.get("https://api.motimanager.com/artikles/")
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

  return (
    <div>
      <div style={{backgroundColor:"rgba(255,255,255,0.3)"}}>
        <div style={{maxWidth:"1000px", margin:"0 auto", padding:"15px"}}>
          <h1 style={{margin:0}}>ARTIKEL</h1>
          <h4>Globally Shared Flashcards to Learn German</h4>
        </div>
        </div>
        <div className="nav" >
          {navArray.map((category, key)=>(
            <div className={category === nav? "active": ""} key={key}
            onClick={()=>setNav(category)}>{category}</div>
          ))}
        </div>
      
      <div style={{textAlign:"center", margin:"0 auto", padding:"20px 0"}}>
        <Card quiz={quiz} nextCard={nextCard} mode={nav} />
        <p/>
        <p/>
        <Add />
        <div style={{height:"100px"}} />
        <div style={{ backgroundColor:"rgb(70,70,70)", color:"white", borderRadius:"5px", maxHeight:"400px", overflow:"auto", padding:"20px", maxWidth:"800px", margin:"0 auto" }}>
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
      <animated.div style={fade}>
          <h3>This website uses cookies to save your high score and your custom cards!</h3>
          <button style={{ fontSize: "15px" }} onClick={()=>setConsent(true)}>Alright!</button>
      </animated.div>
    </div>
  );
}

export default App;
