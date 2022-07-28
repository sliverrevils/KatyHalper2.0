interface IVideoProps{
    winClose:()=>void
}

export const VideoScreen: React.FC<IVideoProps> = ({winClose}) => {


    return (
        <div className="black-screen" onClick={winClose}>
            <iframe width="560" height="315"
                src="https://www.youtube.com/embed/dU7ruLWlLQQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        </div>
    )
}