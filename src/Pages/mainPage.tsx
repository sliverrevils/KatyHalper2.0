import React from "react";
import { ItemsList } from "../Components/VideosList/videos-list";
import { NavBar } from "../Components/NavBar/navbar";
import { Test } from "../Components/test";



export const MainPage:React.FC=()=>{

    return (
    <div className="main-page">
        
        <input type="text" defaultValue={'00 час : 06 мин : 48 сек'} />
            <NavBar/>
            <ItemsList/>
            
    </div>
    )
}


