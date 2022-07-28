import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playSound } from "../../Media/media";
import { changeSpin, setAlarm, setAlarmStatus, setColor } from "../../Redux/Slices/items.slice";
import { SpinScreen } from "../SpinScreen/spinscreen";

const alert_mp3 = require('../../Sound/alarm.mp3');




interface IShotProps {
    id: string
    videoId: string
    time: string
    date: string
    spin: string
    videoLink: string
    alarm: string
    color: string
    alarmStatus?: string
    test?:boolean
    delShot(): void
    
}

export function calcTimeCode(videoLink: string, textCode: string) {
    let arr = textCode.split(' ');
    let secs = (+arr[0] * 60 * 60) + (+arr[3] * 60) + (+arr[6]);
    let videoName = videoLink.split('=');

    const timeLink = `https://www.youtube.com/embed/${videoName[1]}?autoplay=1&mute=1&iv_load_policy=3&rel=0&autohide=1&start=${secs}`;
    return timeLink;
}


export const ShotItem: React.FC<IShotProps> = ({ videoId, id, time, delShot, videoLink, alarm, alarmStatus, spin, date, color,test }) => {
    const [spinFiled, setSpinFiled] = useState(false);
    const [alarmIco, setAlarmIco] = useState();
    const [alarmState, setAlarmState] = useState('');    
    
    const soundRef = useRef<HTMLAudioElement>(playSound(alert_mp3, 1));

    const dispatch = useDispatch();


    //-------------------------------- SPIN

    const onChangeSpin = (event: any) => {
        event.stopPropagation();
        setSpinFiled(true);
    }

    const shooseSpin = (spin: string) => {
        dispatch(changeSpin({ id, videoId, spin }));
        setSpinFiled(false);

    }



    //-------------------------------ON CLICK

    const onClick = (event: any) => {

        if (event.target == event.currentTarget) {
            if (event.currentTarget.classList.contains('active')) {
                event.currentTarget.classList.remove('active');
                return
            } else {
                Array.from(document.querySelectorAll('.shot-item')).forEach(el => el.classList.remove('active'));
                event.currentTarget.classList.add('active');
                return
            }
        }

        if (event.target.innerText === 'notifications_active') {
            //------------------------------------------------------------------
            alarmCancel();
        }

    }


    //-------------------------------------- SET COLOR

    const onSetColor = (color: string) => {

        dispatch(setColor({ id, videoId, color }));
    }

    //CHANGE COLOR
    const [colorState, setColorState] = useState(color);
    const onContextMenu = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const arrColor = ['black', 'green', 'deeppink', 'tomato', 'lime', 'gold', 'teal'];
        const nextColor = arrColor[(arrColor.findIndex(el => el === colorState)) + 1]
        setColorState(nextColor);
        dispatch(setColor({id,videoId ,color:nextColor}));
       // console.log('COLOR', colorState)
    }
    //useEffect(() => setColorState(color), [color])



    //----------------------------------------ALARM


    //-SET
    const calcTimeToAlarm = () => {
        console.log(Math.floor((new Date(alarm + '').getTime() - Date.now()) / 1000));
        return Math.floor((new Date(alarm + '').getTime() - Date.now()) / 1000);
    }

    const onSetAlarm = (event: any) => {
        if((new Date(event.currentTarget.value).getTime()-Date.now())>0){
        setAlarmState(event.currentTarget.value);
        dispatch(setAlarm({ videoId, id, alarm: event.currentTarget.value }));
        dispatch(setAlarmStatus({ id, videoId, alarmStatus: 'pending' }));
        }else{
            setAlarmState('');
            dispatch(setAlarm({ videoId, id, alarm: null }));
        dispatch(setAlarmStatus({ id, videoId, alarmStatus: null }));
        }
        
    }
    const onClearDate = () => {
        dispatch(setAlarm({ videoId, id, alarm: '' }));
        dispatch(setAlarmStatus({ id, videoId, alarmStatus: null }));
    }
    
   

    const timer = useRef<any>();
    


    //------------- alarm interval 
    const [timeLeft, setTimeLeft] = useState(calcTimeToAlarm()); //seconds left
    const timerFunc = () => {
        alarm && (timer.current = setTimeout(() => {
            clearTimeout(timer.current);

            const seconds = calcTimeToAlarm();
            setTimeLeft(seconds > 0 ? seconds : 0);

            calcTimeToAlarm() > 0 && timerFunc();
        }, 1000));
    }

    useEffect(() => {
        timerFunc();
        return () => clearTimeout(timer.current);
    }, [alarm]);

    //alarm status

    useEffect(() => {
        //console.log('TIMELEFT',timeLeft);
        if (!isNaN(timeLeft))
            if (alarm) {
                //console.log('TIMELEFT',timeLeft);
                timeLeft > 0 && (!alarmStatus || alarmStatus === 'finish' || alarmStatus === 'missed') && dispatch(setAlarmStatus({ id, videoId, alarmStatus: 'pending' }));
                timeLeft === 0 && alarmStatus === 'pending' && dispatch(setAlarmStatus({ id, videoId, alarmStatus: 'finish' }));
            } else {
                dispatch(setAlarmStatus({ id, videoId, alarmStatus: null }));
            }
    }, [timeLeft]);

    
    //play sound

    useEffect(() => {
        if (timeLeft === 1 && alarmStatus === 'pending') {
            //console.log('ALARM!!!');
            dispatch(setAlarmStatus({ id, videoId, alarmStatus: 'play' }))
            // soundRef.current= playSound(alert_mp3,1);
            soundRef.current.play();
            soundRef.current.addEventListener('ended', () => dispatch(setAlarmStatus({ id, videoId, alarmStatus: 'missed' })))
        }
    }, [timeLeft]);


    //alarm ico

    useEffect(() => {
        let obj: any = {}
        if (alarmStatus) {
            obj = {
                'pending': () => <span className="material-icons">notifications</span>,
                'play': () => <span className="material-icons" style={{color:'tomato',animation:'select 400ms linear infinite',cursor:'pointer'}}>notifications_active</span>,
                'missed': () => <span className="material-icons" style={{color:'orange'}}>notification_important</span>,
                'canceled': () => <span className="material-icons" style={{color:'lightgrey'}}>notifications_off</span>,
            }
            setAlarmIco(obj[alarmStatus]);
        }


    }, [alarmStatus]);


    function alarmCancel() {
        console.log('STOP ALARM', soundRef.current);
        dispatch(setAlarmStatus({ id, videoId, alarmStatus: 'canceled' }));
        setTimeLeft(0);
        soundRef.current.pause();
    }  

   
    //------------------COMPONENT MOUNT\UNMOUNT
    useEffect(() => {
        console.log('RENDER-SHOT : ', id);
        return ()=>{
            console.log('DEL SHOT');
            soundRef.current.pause();
        };
    }, [])

    // DEL ANIM FUNCS
    const wontDel=useCallback((event:any)=>{
        
         event.target.parentElement.children[0].children[0].style.textDecoration='line-through'
    },[]);

    const notDel=useCallback((event:any)=>{        
        event.target.parentElement.children[0].children[0].style.textDecoration='none'
    },[]);

    return (
        <div className='shot-item' tabIndex={0}  {...{ onClick, onContextMenu }}  >

          

            {spinFiled && <SpinScreen winClose={() => setSpinFiled(false)} {...{ shooseSpin, videoLink, time, onSetColor, color, onContextMenu, colorState }} />}

            <div className="shot-item__timewrap">
                <a className="shot-item__timewrap__time" href={calcTimeCode(videoLink, time)} target='blank'>{time}</a>
                <label htmlFor="alarm" className="shot-item__timewrap__input">
                    <input id='alarm' type={'datetime-local'} onChange={onSetAlarm} value={alarmState} className="shot-item__timewrap__alarm-input" style={{ width: 20, padding: 0, margin: 0, height: 20, cursor: 'pointer' }} />
                    {alarm && alarm.replace('T', '  ')}
                    {alarm && <i className="material-icons shot-item__timewrap__time-clear" onClick={onClearDate}>hourglass_disabled</i>}
                </label>
                {alarm&&alarmIco}
            </div>
            {/* {alarmStatus}
            {timeLeft >= 0 && timeLeft} */}


            <div className="shot-item__spin_wrap">
                <i className={`material-icons shot-item__spin`} style={{ color: colorState }} onClick={onChangeSpin}>filter_tilt_shift</i>
                <span className="shot-item__spin_wrap__direction">{spin}</span>
            </div>


            <span className="shot-item__date">{date}</span>
            <i className="material-icons gray-text shot-item__delshot" onClick={(event: any) => { event.stopPropagation(); delShot() }} onMouseEnter={wontDel} onMouseLeave={notDel}> highlight_off</i>

        </div>

    )
}