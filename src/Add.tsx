import React, { useState } from "react"
import axios from "axios"
import { api } from "./reducer"

const Add:React.FC = () =>{
    const [word, setWord] = useState("")
    const [name, setName] = useState("Anonymous")
    const [added, setAdded] = useState(false)
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState(false)

    return(
      <div style={{padding: "0 10px"}}>
        <div 
          style={{
            backgroundColor:"white",
            boxShadow:"0 0 20px rgba(0,0,0,0.5)",
            padding:"20px",
            borderRadius:"10px",
            maxWidth:"300px",
            margin: "0 auto",
          }}
        >
          {added?
          <div>
              <h2>Thank you for sharing!</h2>
              <h4>The word will be added if it's a valid word.</h4>
              <button onClick={()=>setAdded(false)}>Add more words</button>
              </div>
          :<div>
              <h2>Add New Words!</h2>
              <h4 style={{ margin: 0 }}>*Without the article</h4>
          <p/>
          <input
            placeholder="Word..."
            onChange={event=>{
                if( event.target.value.length < 15 )setWord(event.target.value)
            }}
             value={word}
          />
          <br/>
          <input
            placeholder="Your Name..."
            onChange={event=>{
                if( event.target.value.length < 15 )setName(event.target.value)
            }}
             value={name}
          />
          <br/>
          {adding?
          <h3>Adding...</h3>
          :
          <button
            onClick={()=>{
              setError(false)
                if( name && word.length > 2 ){
                    let today = new Date()
                    let time = Number(today.getMonth() + 1 )+ "." + today.getDate() + "." + today.getFullYear()
                    setAdding(true)
                    let edit = word.toLowerCase()
                    edit = edit.charAt(0).toUpperCase() + edit.slice(1)
                    let newWord = {
                      name: name,
                      word: edit,
                      time: time
                    }
                    axios.post(
                      `${api}post`,
                      newWord
                    )
                    .then(res=>{
                        setWord("")
                        setAdding(false)
                        if(res.data) {
                          setAdded(true)
                        }
                        else setError(true)
                    })
                    .catch(()=>{
                        setAdding(false)
                    })
                }
            }}
          >
            ADD
          </button>
        }
        {error?
          <h3 style={{color:"rgb(200,0,0)"}}>The word was already added!</h3>
        :null}
        </div>
        }
      </div>
    </div>
  )
}

export default Add