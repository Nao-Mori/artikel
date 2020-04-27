import React from "react"

interface State {
    article: string,
    word: string
}


const Wrapper:React.FC<State> = props => {
    return(
        <div style={{position:"fixed",top:0, left: 0, height: "100vh", width:"100vw",backgroundColor:"rgba(0,0,0,0.5)"}}>
            <div style={{backgroundColor:"white", marginTop:"25vh", padding:"15px"}}>
                <h1 style={{margin: 0}}>{props.article} {props.word}</h1>
                {props.children}
            </div>
        </div>
    )
}

export default Wrapper