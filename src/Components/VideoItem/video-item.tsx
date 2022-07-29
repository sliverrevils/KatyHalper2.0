import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { ShotItem } from '../ShotItem/shot-item';
import { delShot, delVideo } from '../../Redux/Slices/items.slice';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { playSound } from '../../Media/media';
import { Test } from '../test';


interface IVideoProps {
    id: string 
    link: string
    index: number
    name: string
    addShotItem(id: string): void
}

export const VideoItem: React.FC<IVideoProps> = ({ id, link, index, addShotItem, name }) => {
    const { shots } = useSelector((state: any) => state.items.videos[index]);
    const dispatch = useDispatch();
    const onDelShot = useCallback((el: any) => dispatch(delShot(el)),[]);
    const onDelVideo = (id: string): void => {
        // eslint-disable-next-line no-restricted-globals
        const ask = confirm('Удалить видео?');
        ask && dispatch(delVideo(id));
    }
    const onAddShot = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('ADD ID',id);
        addShotItem(id);
    }

    useEffect(()=>console.log('RENDER ITEM'),[]);


    


    const shotsList=useMemo(()=>(
        <TransitionGroup className={'shot-list'}>
        {
            shots.map((el: any) => (
            <CSSTransition key={el.id} timeout={500} classNames='shotItem'>
                <div>
                <ShotItem
                    id={el.id}
                    videoId={el.videoId}
                    videoLink={link}
                    time={el.timeShot}
                    alarm={el.alarm}
                    key={el.id}
                    alarmStatus={el.alarmStatus}
                    spin={el.spin}
                    date={el.date}
                    color={el.color} 
                    delShot={() => onDelShot(el)} 
                   
                    />
                    {/* <Test key={nanoid()} {...{...el,onDelShot}}/> */}
                    </div>
            </CSSTransition>
            ))                   
        }
        
    </TransitionGroup>
    ),[shots]);


    const videoNameFixer=(name:string):string=>{

        return name.length>40?name.substring(0,40)+'...':name
    }
    //DEL ANIM FUNCS
    const wontDel=useCallback((event:any)=>{
        event.target.parentElement.parentElement.style.backgroundColor='black';
        event.target.parentElement.children[0].children[1].style.color='red';
        event.target.parentElement.children[1].children[0].style.color='white';
        // event.target.parentElement.children[1].children[0].style.textDecoration='line-through'
    },[]);

    const notDel=useCallback((event:any)=>{
        event.target.parentElement.parentElement.style.backgroundColor='';
        event.target.parentElement.children[0].children[1].style.color='black';
        event.target.parentElement.children[1].children[0].style.color='black';

       // event.target.parentElement.children[1].children[0].style.textDecoration='none'
    },[]);
    

    return (
        <div className='video-item' onContextMenu={onAddShot}>
            <div className='video-item__title'>
                <div className='video-item__title__indexwrap'>
                <i className='material-icons gray-text'>ondemand_video</i>
                <span className='video-item__title__indexwrap__index'>{index+1}</span>
                </div>
                 
                <div className='video-item__title__wrap' >
                <a className='video-item__title__wrap__name' href={link} target='blank'>{videoNameFixer(name)}</a>
                {/* <a className='video-item__title__wrap__link' href={link} target='blank'>{link}</a> */}
                </div>
                
                
                <i className="material-icons  video-item__title__close" onClick={onDelVideo.bind(null, id + '')} onMouseEnter={wontDel} onMouseLeave={notDel} > delete</i>
            </div>

           {shotsList}

        </div>
    )
}