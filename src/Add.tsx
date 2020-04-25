import React, { useState } from "react"
import axios from "axios"

interface Prop{
  update: any
}

const arts = ["das", "der", "die"]
const Add:React.FC<Prop> = ({ update }) =>{
    const [article, setArticle] = useState("")
    const [word, setWord] = useState("")
    const [name, setName] = useState("Anonymous")
    const [added, setAdded] = useState(false)
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState(false)

    return(
        <div 
          style={{
            backgroundColor:"white",
            boxShadow:"0 0 20px rgba(0,0,0,0.5)",
            padding:"20px",
            borderRadius:"20px",
            maxWidth:"300px",
            margin: "0 auto"
          }}
        >
          {added?
          <div>
              <h2>Thank you for sharing!</h2>
              <button onClick={()=>setAdded(false)}>Add more words</button>
              </div>
          :<div>
              <h2>Add New Words!</h2>
          <p/>
          {arts.map((art, key)=>{
              return(
                <button
                    key={key}
                    style={art === article?
                    {backgroundColor: "orange"}
                    :{}}
                    onClick={()=>setArticle(art)}
                >
                    {art}
                </button>
              )
          })}
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
                if( name && word.length > 2 && article ){
                    let today = new Date()
                    let time = Number(today.getMonth() + 1 )+ "." + today.getDate() + "." + today.getFullYear()
                    setAdding(true)
                    let edit = word.toLowerCase()
                    edit = edit.charAt(0).toUpperCase() + edit.slice(1)
                    let newWord = {
                      name: name,
                      word: edit,
                      article: article,
                      time: time
                    }
                    axios.post(
                      'https://api.motimanager.com/artikle/post',
                      newWord
                    )
                    .then(res=>{
                        setWord("")
                        setArticle("")
                        setAdding(false)
                        if(res.data) {
                          setAdded(true)
                          update(newWord)
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
    )
}

export default Add