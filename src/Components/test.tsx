
import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { setColor } from '../Redux/Slices/items.slice';

export const Test:React.FC<any> =({id,videoId,color,timeShot,spin})=>{

    // const {timeShot,spin}:any=useSelector<any>(state=>{
    //     const videoIndex=state.items.videos.findIndex((el:any)=>el.id===videoId);
    //     const shotIndex=state.items.videos[videoIndex].shots.findIndex((el:any)=>el.id===id)
    //     return state.items.videos[videoIndex].shots[shotIndex];
    // });

    const dispatch=useDispatch();


    const onClick=()=>{
        dispatch(setColor({id,videoId,color:'white'}));
    }


    useEffect(()=>{
        console.log('TEST RENDER');
        return ()=>console.log('DELETE TEST')
    },[])
    return(
        
        <div>
           <span {...{onClick}}> {`${timeShot} : ${spin} : ${color}`} </span>
        </div>
    )
}