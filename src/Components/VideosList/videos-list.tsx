import React, { useEffect, useMemo, useState } from "react";
import {useDispatch,useSelector} from 'react-redux';
import { addShot, addVideo } from "../../Redux/Slices/items.slice";
import { VideoItem } from "../VideoItem/video-item";

interface IVideoItem{
    id:string,
    link:string
    name:string
}
interface IVideoItems extends Array<IVideoItem>{}

interface IVideosArr{
    items:{
        videos:IVideoItems
    }
}


export const ItemsList:React.FC=()=>{
    
    const dispatch=useDispatch(); 

    const videosArr=useSelector((state:IVideosArr)=>state.items.videos);


    const fromClipboard=async()=>await navigator.clipboard.readText().then(link=>link)

    const addItemVideo=async(event:MouseEvent)=>{
        event.preventDefault();        
        const link= await fromClipboard();
        if(/^https:..www.youtube.com./.test(link))
        dispatch(addVideo({link,name:link.split('=')[1]}));
        else
        alert(`В буфере нет ссылки на видею Yputube`);
    };    

    const addShotItem=async(id:string,parent:string='')=>{
        const timeShot=await fromClipboard();
        if(/^[0-9]{2} час : [0-9]{2} мин : [0-9]{2} сек$/.test(timeShot))
        dispatch(addShot({videoId:id,timeShot,parent}));
        else
        alert('Ошибка удара');
    }

    

    useEffect(()=>{
        window.addEventListener('contextmenu',addItemVideo);
        // eslint-disable-next-line no-restricted-globals
         return ()=>removeEventListener('contextmenu',addItemVideo);
    },[]);   

    //SAVE TO LS
    useEffect(()=>{
        localStorage.setItem('videos',JSON.stringify(videosArr));
    },[videosArr]);
    
    const videoList=useMemo(()=>videosArr?.map((el:IVideoItem,index:number)=><VideoItem name={el.name} key={el.id} id={el.id} link={el.link} {...{  index, addShotItem }}/>) ,[videosArr])
    return(
       
           
            
            <div className={'video-list'}>
            { videoList }
            </div>
            

       
    )
}

