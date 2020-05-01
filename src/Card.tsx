import React, { useState, useEffect } from "react"
import { Flag, CheckBox, CropSquare, Book, Star } from "@material-ui/icons"
import * as emailjs from 'emailjs-com'
import axios from "axios"
import Wrapper from "./FixedWrapper"
import { animated, useSpring } from "react-spring"
import ReactLoading from 'react-loading';

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
        time: string,
        definition: string,
    },
    nextCard:()=> void,
    mode: string
}

interface Report {
    article: string,
    word: string,
    name: string,
    time: string,
    definition: string
}

const Card:React.FC<State> = ({quiz, nextCard, mode}) => {
    const [streak, setStreak] = useState(0)
    const [report, setReport] = useState(false)
    const [reason, setReason] = useState(0)
    const [answer, setAnswer] = useState("")
    const [highScore, setHighScore] = useState<number | null>(null)
    const [reportCard, setReportCard] = useState<Report>({
        article: "",
        word: "",
        name: "",
        time: "",
        definition: "",
    })
    const [option, setOption] = useState<string[]>([])
    const [definition, setDefinition] = useState(false)
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState(initialDetail)
    const [swapping, setSwapping] = useState(false)

    const swap = useSpring({
        opacity: swapping? 0: 1,
        marginTop: swapping? "30px" : "0px",
        backgroundColor: "white",
        boxShadow:"0 0 20px rgba(0,0,0,0.5)",
        padding:"20px",
        borderRadius:"20px",
        maxWidth:"500px",
        marginLeft: "auto",
        marginRight: "auto",
    })

    

    useEffect(()=>{
        if(mode === "Spelling") {
            let or = quiz.word
            let arr:string[] = [or]
            for(let i = 1; i < or.length - 1; i ++) {
                if(i === 5) break;
                let misspell = ""
                for( let x = 0; x < or.length; x ++ ) {
                   if(x === i) misspell += or.substring(i + 1, i + 2)
                   else if (x === i + 1) misspell += or.substring(i, i + 1)
                   else misspell += or.substring(x, x+1)
                }
                let random2:number = Math.floor(Math.random() * 2)
                if(random2 === 1) arr.push(misspell)
                else arr.unshift(misspell)
            }
            setOption(arr)
            console.log(arr)
        }
    },[quiz, mode])

    useEffect(()=>{
        if(highScore !== null) {
            if(highScore < streak) {
                setHighScore(streak)
                document.cookie = `Score=${streak}; expires=Thu, 31 Dec ${new Date().getFullYear() + 1} 00:00:00 UTC; path=/;`
            }
        } else if(document.cookie) {
            let value = document.cookie;
            let parts:string[] = value.split("; Score=");
            let numStr = parts[0].split("=")
            setHighScore(Number(numStr[1]))
        } else {
            setHighScore(0)
            document.cookie = `Score=0; expires=Thu, 31 Dec ${new Date().getFullYear() + 1} 00:00:00 UTC; path=/;`
        }
    },[streak])

    const getDetail = () => {
        setDefinition(true)
        if(detail.word !== quiz.word){
            setLoading(true)
            setDetail(initialDetail)
            axios.defaults.timeout = 10000;
            axios.post(
                'https://api.motimanager.com/artikles/definition',
                { word: quiz.word }
            ).then(res => {
                setDetail(res.data)
                setLoading(false)
            }).catch(()=>{
                setDetail({
                    word: quiz.word,
                    article: quiz.article,
                    textDE: "Sorry, failed get an example",
                    textEN: "Sorry, failed get an example",
                    definition: quiz.definition
                })
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

    const answering = (an:string) => {
        if(!answer) {
            setAnswer(an)
            if(an === quiz.article || an === quiz.word) setStreak(streak + 1)
            else setStreak(0)
            setTimeout(()=> {
                setSwapping(true)
                setTimeout(()=>{
                    setSwapping(false)
                    nextCard()
                    setAnswer("")
                },300)
            }, 1000)
        }
    }

    return(
        <div>
            <animated.div 
            style={swap}
            >
            {mode === "Article"?
            <div>
                <h3 style={{margin:0}}>Choose the Correct Article</h3>
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
                         answering(art)
                        }}
                    >
                        {art}
                    </button>
                    )
                })}
            </div>
            : mode === "Spelling" ?
            <div>
                <h3>Choose the word that means...</h3>
                <h1 style={{margin: "21px 5px"}}>"{quiz.definition}"</h1>
                {option.map((opt, key)=>(
                    <button key={key} onClick={()=>answering(opt)}
                    style={
                        quiz.word === opt && answer ?
                        {backgroundColor:"green"}
                        :
                        answer === opt ?
                        {backgroundColor:"rgb(200,0,0)"}
                        :
                        {}
                        }>
                        {opt}
                    </button>
                ))}
            </div>
            :
            <div>
                <h1>Coming Soon!</h1>
            </div>
            }
            <p/>
            <h4>
                <Star fontSize = "large" style = {{ cursor:"pointer", color: "rgb(100,100,100)" }} onClick={()=>{
                    //"rgb(255, 206, 44)"
                }}/>
                <Book
                    fontSize = "large"
                    style = {{cursor:"pointer",color:"rgb(140,40,40)"}}
                    onClick={getDetail}
                    
                />
                <Flag fontSize = "large" style = {{cursor:"pointer",color:"rgb(200,0,0)"}} onClick={()=>{
                    setReport(true)
                    setReportCard(quiz)
                }}/>
                Added by {quiz.name}
            </h4>
            </animated.div>
            <h1>{streak} Streak!</h1>
            <h2 style={{ margin: 0 }}>High Score : {highScore}</h2>
            <br/>
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
                            <h3>Example:<br/> {detail.textDE}</h3>
                            <br/>
                            <h3>Translation:<br/> {detail.textEN}</h3>
                            <p/>
                            <button onClick={()=>setDefinition(false)}>OK</button>
                        </div>
                    :
                        <div style={{maxWidth:"170px", margin:"0 auto", height:"160px"}}>
                            <h4>Opening a dictionary...</h4>
                            <ReactLoading type={"bars"} color={"rgb(103, 97, 202)"} width={"160px"} />
                        </div>
                    }
                </Wrapper>
            :null}
        </div>
    )
}

export default Card