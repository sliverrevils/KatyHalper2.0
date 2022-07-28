 //SOUND
 export function playSound(file:string,volume=0.9):HTMLAudioElement{
    
    const sound=new Audio();
    sound.src=file;
    sound.volume=volume;
    //sound.autoplay=true;
    
    return sound;    

}