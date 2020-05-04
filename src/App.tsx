import React, { useEffect, useState } from 'react';
import axios from "axios"
import Add from './Add';
import Card from "./Card"
import { animated, useSpring } from "react-spring"
import { initialList, api } from "./reducer"
import { FolderOpen } from "@material-ui/icons"

const modeArray = ["Article", "Definition", "Spelling"]
const typeArray = ["Noun", "Verb", "All", "Starred"]

const App:React.FC = () => {
  const [list, setList] = useState(initialList)
  const [fail, setFail] = useState(false)
  const [consent, setConsent] = useState(false)
  const [mode, setMode] = useState<string>(modeArray[0])
  const [type, setType] = useState<string>(typeArray[0])
  const [folder, setFolder] = useState<boolean>(false)

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
    axios.get(`${api}`)
    .then(res => {
      setList(res.data.list)
      for( let i = 0; i < res.data.list.length; i ++ ) {
        if(!res.data.list[i].definition) {
          console.log(i,res.data.list[i].word)
        }
      }
    })
    .catch(()=> setFail(true))
  },[])

  return (
    <div>
      <div style={{backgroundColor:"rgba(255,255,255,0.3)"}}>
        <div style={{maxWidth:"90%", margin:"0 auto", padding:"15px 0"}}>
          <div style={{ display: "flex", justifyContent: "space-between"}}>
            <h1 style={{margin:0}}>ARTIKEL</h1> 
            <button
             style={{ display: "flex", fontSize:"15px"}}
             onClick={()=>setFolder(true)}
            >
              <FolderOpen />
              <h3 style={{paddingTop:"3px", paddingLeft:"3px"}}>
                {type}
              </h3>
            </button>
          </div>
          <h4>Globally Shared Flashcards to Learn German</h4>
        </div>
        </div>
        <div className="nav" >
          {modeArray.map((category, key)=>(
            <div className={category === mode? "active": ""} key={key}
            onClick={()=>setMode(category)}>{category}</div>
          ))}
        </div>
      
      <div style={{textAlign:"center", margin:"0 auto", padding:"20px 0"}}>
        <Card list={list} mode={mode} type={type} />
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
      {folder?
      <div style={{ position:"fixed", width:"100vw", height: "100vh", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div style={{ width:"100%", background: "white", marginTop: "25vh", textAlign: "center", padding:"10px 0" }}>
        <h1 style={{margin: "5px"}}>Choose a folder!</h1>
        <h4>*The change will be made from the next card.</h4>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "10px 0" }}>
          {typeArray.map((ty, key)=>(
            <button key={key}
            style={{ fontSize: "15px", display: "flex" }}
            onClick={()=> {
              setType(ty)
              setFolder(false)
            }}>
              <FolderOpen />
              <h3 style={{ paddingLeft: "3px", paddingTop: "3px" }}>{ty}</h3>
            </button>
          ))}
          </div>
          <button className="red" onClick={()=>setFolder(false)}>Cancel</button>
        </div>
      </div>
      :null}
      <animated.div style={fade}>
          <h3>This website uses cookies to save your high score and your custom cards!</h3>
          <button style={{ fontSize: "15px" }} onClick={()=>setConsent(true)}>Alright!</button>
      </animated.div>
    </div>
  );
}

export default App;
