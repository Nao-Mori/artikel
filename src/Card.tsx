import React, { useState, useEffect } from "react"
import { Flag, CheckBox, CropSquare, Book, Star } from "@material-ui/icons"
import * as emailjs from 'emailjs-com'
import axios from "axios"
import Wrapper from "./FixedWrapper"
import { animated, useSpring } from "react-spring"
import ReactLoading from 'react-loading';
import { initialList, api } from "./reducer"

const arts = ["das", "der", "die"]
const reasons = ["Inappropriate word",  "Deprecated word"]

const initialDetail = {
    article: "",
    word: "",
    definition: "",
    textEN: "",
    textDE: ""
}

const initialReport = {
    article: "",
    word: "",
    name: "",
    time: "",
    definition: "",
    type: ""
}

interface State {
    list: {
        article: string,
        word: string,
        name: string,
        time: string,
        definition: string,
        type: string

    }[],
    type: string,
    mode: string
}

interface Quiz {
    article: string,
    word: string,
    name: string,
    time: string,
    definition: string,
    type : string | undefined
}

let initialNum = Math.floor(Math.random() * 5)

const Card:React.FC<State> = ({ list, mode, type }) => {
    const [quiz, setQuiz] = useState<Quiz>(initialList[initialNum])

    const [streak, setStreak] = useState(0)
    const [report, setReport] = useState(false)
    const [reason, setReason] = useState(0)
    const [answer, setAnswer] = useState("")
    const [highScore, setHighScore] = useState<number | null>(null)
    const [reportCard, setReportCard] = useState<Quiz>(initialReport)

    const [myCards, setMyCards] = useState<Quiz[]>([])
    const [starred, setStarred] = useState<boolean>(false)

    const [option, setOption] = useState<string[]>([])

    const [error, setError] = useState<boolean>(false)

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
        borderRadius:"15px",
        maxWidth:"500px",
        marginLeft: "auto",
        marginRight: "auto",
    })

    useEffect(()=>{
        let or = quiz.word
        let arr:string[] = [or]
        if(mode === "Spelling") {
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
        } else if (mode === "Definition") {
            arr = [or, or, or]

            while ( arr.length !== new Set(arr).size ) {
                arr = [or]
                for( let i = 0; i < 3; i ++ ) {
                    let ranNum = Math.floor(Math.random() * 2)
                    let ranNum2 = Math.floor(Math.random() * list.length)
                    if(ranNum) arr.push(list[ranNum2].word)
                    else arr.push(list[ranNum2].word)
                }
            }
            setOption(arr)

        }
    },[quiz, mode])

    const takeCookies = () =>{
        let value = document.cookie;
        let parts:string[] = value.split(/;|=/);
        let final = { highScore: 0, myCards: [] }
        console.log(parts)
        if(parts.length === 4) {
            if(parts[0] === "Score" ) {
                final.highScore = Number(parts[1])
                final.myCards = JSON.parse(parts[3])
            } else {
                final.highScore = Number(parts[3])
                final.myCards = JSON.parse(parts[1])
            }
        }
        return final
    }

    useEffect(()=> {
        if(highScore !== null) {
            if(highScore < streak) {
                setHighScore(streak)
                document.cookie = `Score=${streak}; expires=Thu, 31 Dec ${new Date().getFullYear() + 1} 00:00:00 UTC; path=/;`
            }
        } else if (document.cookie) {
            let cookie = takeCookies()
            setHighScore(cookie.highScore)
            setMyCards(cookie.myCards)
            console.log(cookie.myCards)
        } else {
            setHighScore(0)
            document.cookie = `Score=0; expires=Thu, 31 Dec ${new Date().getFullYear() + 1} 00:00:00 UTC; path=/;`
            let array:string[] = []
            document.cookie = `MyCards=${JSON.stringify(array)}; expires=Thu, 31 Dec ${new Date().getFullYear() + 1} 00:00:00 UTC; path=/;`
        }
    },[streak])

    const nextCard = () => {
        setStarred(false)
        let typeStr = type? type.toLowerCase() : "noun"
        if( typeStr === "starred" ) {
            setStarred(true)
            if(myCards.length === 1){
                setQuiz(myCards[0])
            } else if (myCards.length > 1){
                let tempList = myCards.filter(item => item.word !== quiz.word)
                let random:number = Math.floor(Math.random() * tempList.length)
                setQuiz(tempList[random])
            } else {
                setError(true)
            }
        } else {
            let temp = list.filter(item => item.word !== quiz.word)
            let tempList = typeStr !== "all" ? temp.filter(item => item.type === typeStr) : temp
            let random:number = Math.floor(Math.random() * tempList.length)
            if( type !== "starred" ) {
                for (let i = 0; i < myCards.length; i ++) {
                    if(myCards[i].word === tempList[random].word) {
                        setStarred(true)
                        break;
                    }
                }
            } 
            setQuiz(tempList[random])
        }
    }

    const getDetail = () => {
        setDefinition(true)
        if(detail.word !== quiz.word){
            setLoading(true)
            setDetail(initialDetail)
            axios.defaults.timeout = 10000;
            axios.post(
                `${api}definition`,
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

    useEffect(()=> {
        document.cookie = `MyCards=${JSON.stringify(myCards)}; expires=Thu, 31 Dec ${new Date().getFullYear() + 1} 00:00:00 UTC; path=/;`
    },[myCards])

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
            <div style={{padding: "0 10px"}}>
                <animated.div 
                style={swap}
                >
                {error?
                    <div>
                        <h3>Looks like there's no word in this folder!
                            <br/>
                        Please select another folder and refresh.</h3>
                        <button onClick={()=>{
                            setError(false)
                            nextCard()
                        }}>Refresh</button>
                    </div>
                    :<div>
                        {mode === "Article"?
                        <div>
                            {quiz.article ?
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
                            :
                            <div>
                                <h2>The next word is not a noun!<br/>Please play either "Definition" or "Spelling" mode.</h2>
                            </div>
                            }
                        </div>
                        :
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
                        }
                        <p/>
                        <h4>
                            <Star fontSize = "large" style = {{ cursor:"pointer", color: starred? "rgb(255, 206, 44)" : "rgb(100,100,100)" }}
                            onClick={()=>{
                                setStarred(!starred)
                                if(!starred) {
                                    console.log(myCards)
                                    setMyCards([...myCards, quiz])
                                } else {
                                    setMyCards(myCards.filter(item => item.word !== quiz.word));
                                }
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
                    </div>}
                </animated.div>
            </div>
            <div style={{
                background:"rgba(255, 255, 255, 0.7)",
                padding:"10px",
                margin: "30px auto"
                }}>
            <h1 style={{ margin: 0 }}>{streak} Streak!</h1>
            <h2 style={{ margin: 0 }}>High Score : {highScore}</h2>
            </div>
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
                        <div style={{maxWidth:"250px", margin:"0 auto", height:"180px"}}>
                            <h4>Opening a dictionary...</h4>
                            <div style={{maxWidth:"150px", margin:"0 auto" }}>
                                <ReactLoading type={"bars"} color={"rgb(103, 97, 202)"} width={"160px"} />
                            </div>
                        </div>
                    }
                </Wrapper>
            :null}
        </div>
    )
}

export default Card