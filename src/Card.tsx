import React, { useState } from "react"
import { Flag, CheckBox, CropSquare, Book } from "@material-ui/icons"
import * as emailjs from 'emailjs-com'

const arts = ["das", "der", "die"]
const reasons = ["Incorrect article", "Non-existent / misspelled word", "Inappropriate / deprecated word"]

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
    const [reportCard, setReportCard] = useState<Report>({
        article:"",
        word: "",
        name: "",
        time: "",
    })
    const [answer, setAnswer] = useState("")

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
                <a
                href = {`https://dictionary.cambridge.org/dictionary/german-english/${quiz.word}`}
                target = "blank"
                >
                    <Book
                        fontSize = "large"
                        style = {{cursor:"pointer",color:"rgb(140,40,40)"}}
                        
                    />
                </a>
                <Flag fontSize = "large" style = {{cursor:"pointer",color:"rgb(200,0,0)"}} onClick={()=>{
                    setReport(true)
                    setReportCard(quiz)
                }}/>
            </h4>
            </div>
            <h1>{streak} Streak!</h1>
            {report?
            <div style={{position:"fixed",top:0, left: 0, height: "100vh", width:"100vw",backgroundColor:"rgba(0,0,0,0.5)"}}>
                
                <div style={{backgroundColor:"white", marginTop:"25vh", padding:"15px"}}>
            <h1 style={{margin: 0}}>{reportCard.article} {reportCard.word}</h1>
                <div style={{margin:"0 auto", maxWidth:"300px", textAlign:"left"}}>
                    {reasons.map((desc, key)=>{
                        return (
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
                        )
                    })}
                </div>
                <p/>
                <button onClick={()=>{
                    setReport(false)
                    submit()
                }}>Report</button>
                <button onClick={()=>setReport(false)}>Cancel</button>
                </div>
            </div>
            :null}
        </div>
    )
}

export default Card