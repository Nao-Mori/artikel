import React, { useState } from "react"
import { Flag, CheckBox, CropSquare, Book } from "@material-ui/icons"
import * as emailjs from 'emailjs-com'
import axios from "axios"
import Wrapper from "./FixedWrapper"

const arts = ["das", "der", "die"]
const reasons = ["Inappropriate word",  "Deprecated word"]

const initialDetail = {
    article: "",
    word: "",
    definition: "",
    textEN: "",
    textDE: ""
}

interface State {
    quiz: {
        article: string,
        word: string,
        name: string,
        time: string
    },
    nextCard: any
}

interface Report {
    article: string,
    word: string,
    name: string,
    time: string
}

const Card:React.FC<State> = ({quiz, nextCard}) => {
    const [streak, setStreak] = useState(0)
    const [report, setReport] = useState(false)
    const [reason, setReason] = useState(0)
    const [answer, setAnswer] = useState("")
    const [reportCard, setReportCard] = useState<Report>({
        article: "",
        word: "",
        name: "",
        time: "",
    })
    const [definition, setDefinition] = useState(false)
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState(initialDetail)

    const getDetail = () => {
        setDefinition(true)
        if(detail.word !== quiz.word){
            setLoading(true)
            setDetail(initialDetail)
            axios.post(
                'https://api.motimanager.com/artikles/definition',
                { word: quiz.word }
            ).then(res => {
                setDetail(res.data)
                setLoading(false)
            })
        }
    }

    const submit=()=>{
        let templateParams = {
            from_name: `Artikle`,
            to_name: 'Nao',
            subject: `Word report`,
            message_html: `${reportCard.article} ${reportCard.word} was reported for ${reasons[reason]}`,
        }
        emailjs.send(
            'gmail',
            'template_E4vRe8bo',
            templateParams,
            'user_DidFMxhza8zx9YgRNBTYS'
        )
    }

    return(
        <div>
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
            <h2 style={{margin:0}}>Choose the Correct Article</h2>
            <h1><label>{answer?quiz.article:"_____"}</label>{quiz.word}</h1>
            {arts.map((art, key)=>{
                return(
                <button
                    key={key}
                    style={
                    answer === art && answer === quiz.article ?
                    {backgroundColor:"green"}
                    :
                    answer === art?
                    {backgroundColor:"rgb(200,0,0)"}
                    :
                    {}
                    }
                    onClick={()=>{
                    if(!answer) {
                        setAnswer(art)
                        if(art === quiz.article) setStreak(streak + 1)
                        else setStreak(0)
                        setTimeout(()=> {
                            nextCard()
                            setAnswer("")
                        }, 1500)
                    }
                    }}
                >
                    {art}
                </button>
                )
            })}
            <p/>
            <h4>
                Added by {quiz.name}
                <Book
                    fontSize = "large"
                    style = {{cursor:"pointer",color:"rgb(140,40,40)"}}
                    onClick={getDetail}
                    
                />
                <Flag fontSize = "large" style = {{cursor:"pointer",color:"rgb(200,0,0)"}} onClick={()=>{
                    setReport(true)
                    setReportCard(quiz)
                }}/>
            </h4>
            </div>
            <h1>{streak} Streak!</h1>
            {report?
                <Wrapper article={reportCard.article} word={reportCard.word} >
                        <div style={{margin:"0 auto", maxWidth:"300px", textAlign:"left"}}>
                            {reasons.map((desc, key)=>
                                <h3 key={key} style={{ cursor: "pointer" }}
                                    onClick={()=>setReason(key)}
                                >
                                    {key === reason?
                                    <CheckBox  />
                                    :
                                    <CropSquare  />
                                    }
                                    {" "+desc}
                                </h3>
                            )}
                        </div>
                        <p/>
                        <button onClick={()=>{
                            setReport(false)
                            submit()
                        }}>Report</button>
                        <button onClick={()=>setReport(false)}>Cancel</button>
                </Wrapper>
            :null}
            {definition?
                <Wrapper article={detail.article} word={detail.word} >
                    {!loading?
                        <div>
                            <h2>English: {detail.definition}</h2>
                            <p/>
                            <h3>Example: {detail.textDE}</h3>
                            <h3>Translation: {detail.textEN}</h3>
                            <p/>
                            <button onClick={()=>setDefinition(false)}>OK</button>
                        </div>
                    :
                        <h2>Searching for the definition...</h2>
                    }
                </Wrapper>
            :null}
        </div>
    )
}

export default Card