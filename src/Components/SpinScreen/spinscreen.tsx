import React, { useEffect, useRef, useState } from "react";
import { calcTimeCode } from "../ShotItem/shot-item";
const ball=require('../../IMG/ball.png');
interface IScreenProps{
    winClose:()=>void
    shooseSpin:(spin:any)=>void
    onSetColor:(color:string)=>void
    onContextMenu:(event:any)=>void
    videoLink:string
    time:string
    color:string
    colorState:string
}

export const SpinScreen:React.FC<IScreenProps> =({winClose,shooseSpin,videoLink,time,onSetColor,color,onContextMenu,colorState})=>{
    

    const onBallClick=(event:any)=>{
        event.stopPropagation();
        event.preventDefault();
        const posLeft=event.pageX-event.target.offsetLeft
        const posTop=event.pageY-event.target.offsetTop;
        const ballWidth=event.target.clientWidth;
        const ballHeight=event.target.clientHeight;        
        const x=Math.floor(posLeft/(ballWidth/3)),
        y=Math.floor(posTop/(ballHeight/3));       
        shooseSpin(ballSpin(x,y));
        onSetColor(colorState);
    }

    const ballSpin=(x:number,y:number)=>{        
        if(x==0&&y==0)return 'TL';
        if(x==1&&y==0)return 'TOP';
        if(x==2&&y==0)return 'TR';

        if(x==0&&y==1)return 'L';
        if(x==1&&y==1)return 'CENTER';
        if(x==2&&y==1)return 'R';

        if(x==0&&y==2)return 'DL';
        if(x==1&&y==2)return 'DRAW';
        if(x==2&&y==2)return 'DR';

    }
   
    const frameRef=useRef<any>(null);
    useEffect(()=>{
        calcTimeCode(videoLink,time);
                frameRef.current.focus();
    },[]);

    
    return(
        <div className="black-screen"  onClick={()=>{onSetColor(colorState);winClose();}}> 
       
         
         <iframe width="560" height="315" src={calcTimeCode(videoLink,time)} ref={frameRef} tabIndex={0} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                   
            <img className="black-screen__ball" src={ball} alt="ball"  onClick={onBallClick} {...{onContextMenu}} style={{outline:`10px solid ${colorState}`,borderRadius:'50%'}} />
          
        </div>
    )

}