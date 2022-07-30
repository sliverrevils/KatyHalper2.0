import { createSlice, nanoid } from '@reduxjs/toolkit';

interface IVideo {
    id: string | number
    link: string | number
    shots: string[]
}

interface IState {
    videos: any[]
}

type ISpin = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'back-left' | 'back' | 'back-right';

interface IPayloadShot {
    videoId: string
    timeShot: string
    id?: string
    spin?: ISpin
    alarm?:string
    alarmStatus?:string
    parent?:string
    
}

interface IShot {
    payload: IPayloadShot
}




const initialState: any = {
    videos: [       
        {
            id: "zFNZsrWGFb-ppLKVrBrFX",
            link: "https://www.youtube.com/watch?v=JITC2wCi6qQ",
            name:'BilliardPort Challenge Match:Ferdi Ozdemir vs Çetin Aslan (9 Ball,RaceTo:9,Alternate Break)',

            shots: [
            
            ]
        }
    ]
};



const itemSlice = createSlice({
    initialState:{videos:(JSON.parse(localStorage.getItem('videos')||'[]'))},
    name: 'items',
    reducers: {
        addVideo: {
            prepare: (payload: any): any => ({ payload: { id: nanoid(), link: payload.link,name:payload.name||'unnamed⁉️ 🤔', shots: [] } }),
            reducer: (state: IState, action) => {
                if (state.videos.findIndex(el => el.link === action.payload.link) < 0)
                    state.videos.push(action.payload);
                else
                    alert('Такое видео уже есть');
            }
        },
        delVideo: (state: IState, action) => {
            state.videos = state.videos.filter(el => el.id !== action.payload);
        },
        addShot: {
            prepare: (payload: any): any => ({ payload: { id: nanoid(), ...payload } }),
            reducer: (state, action: IShot) => {                
                const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
                if (state.videos[videoIndex].shots.findIndex((el: any) => el.timeShot === action.payload.timeShot) < 0)
                    if(!action.payload.parent)//ADD PARENT
                    state.videos[videoIndex].shots.push({ ...action.payload, date: new Date().toLocaleString(), spin: '',color:'black',alarmStatus:null,alarm:''});
                    else                      //ADD CHILDREN
                    {                        
                        const shotIndex=state.videos[videoIndex].shots.findIndex((el: any) => el.id === action.payload.parent);
                        console.log('PARENT SHOT',videoIndex,shotIndex);
                        state.videos[videoIndex].shots.splice(shotIndex+1,0,{ ...action.payload, date: new Date().toLocaleString(), spin: '',color:'black',alarmStatus:null,alarm:''})
                    }
                else
                    alert('Такой удар уже есть ‼️');
            }
        },
        delShot: (state, action: IShot) => {
            const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
            // eslint-disable-next-line no-restricted-globals
            if (confirm(`Удалить удар? : ${action.payload.timeShot}`))
                state.videos[videoIndex].shots = state.videos[videoIndex].shots.filter((el: any) => el.id !== action.payload.id);
        },        
        changeSpin: (state, action) => {            
            const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
            state.videos[videoIndex].shots[state.videos[videoIndex].shots.findIndex((el: any) => el.id === action.payload.id)].spin = action.payload.spin
        },
        setAlarm: (state, action) => {
            const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
            state.videos[videoIndex].shots[state.videos[videoIndex].shots.findIndex((el: any) => el.id === action.payload.id)].alarm = action.payload.alarm
        },
        setColor: (state, action) => {
            const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
            state.videos[videoIndex].shots[state.videos[videoIndex].shots.findIndex((el: any) => el.id === action.payload.id)].color = action.payload.color
        }        ,
        setAlarmStatus: (state, action) => {
            const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
            state.videos[videoIndex].shots[state.videos[videoIndex].shots.findIndex((el: any) => el.id === action.payload.id)].alarmStatus = action.payload.alarmStatus
        },
        test:(state,action)=>{
            const videoIndex=state.videos.findIndex((el:any)=>el.id=== action.payload.videoId);
            const shotIndex=state.videos[videoIndex].shots.findIndex((el: any) => el.id === action.payload.id);
            console.log('REDUX ACTION')
        }

    }
});

export const { reducer, actions: { addVideo, addShot, delVideo, delShot, changeSpin,setAlarm ,setColor,setAlarmStatus,test} } = itemSlice;