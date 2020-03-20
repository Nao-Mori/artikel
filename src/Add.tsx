import React, { useState } from "react"
import axios from "axios"

const arts = ["das", "der", "die"]
const Add = () =>{
    const [article, setArticle] = useState("")
    const [word, setWord] = useState("")
    const [name, setName] = useState("")
    const [added, setAdded] = useState(false)
    const [adding, setAdding] = useState(false)

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
            placeholder="Your Word..."
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
                if( name && word.length > 2 && article ){
                    let today = new Date()
                    let time = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear()
                    setAdding(true)
                    axios.post('https://api.motimanager.com',
                    { name: name, word: word, article: article, time: time})
                    .then(()=>{
                        setWord("")
                        setArticle("")
                        setAdded(true)
                        setAdding(false)
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
          </div>
            }
        </div>
    )
}

export default Add