let currentsong=new Audio()
let songs
let currfolder
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder){

    currfolder=folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    console.log(response);
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    // console.log(as);
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])  //take song name only,splits songs url and take name of song after /songs1/
        }
        
    }
    let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML+` 
         <li><img src="music.svg" class="invert" alt="" srcset="">
                    <div class="info">
                        <div>${song.replaceAll("%20"," ")} </div>
                        <div class="artistname">ABC</div>

                    </div>
                    <div class="playnow">
                        <span>Play now</span>
                        <img src="play.svg" class="invert" alt="" srcset="">
                    </div>
                </li>`
    }
    // var audio=new Audio(songs[0]);
    // audio.play();
    // audio.addEventListener("loadeddata",()=>{
    //     let duration=audio.duration
    //     console.log(duration);
        
    // })
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{   //attached event listner to each song
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
        })
        
        
    })
    return songs
    
}
const playmusic=(track,pause=false)=>{
    // let audio=new Audio("/songs1/" + track)
    currentsong.src= `/${currfolder}/` + track
    if(!pause){

        currentsong.play()
        play.src="img/play.svg"
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
}
async function displayalbums(){
    let a = await fetch("/songs1/")
    let response = await a.text();
    // console.log(response);
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    
        if(e.href.includes("/songs") && !e.href.includes("htaccess")){        
            let folder=e.href.split("/").slice(-2)[0]
            
            //get the metadata of the folder
            let a = await fetch(`/songs1/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardcontainer.innerHTML=cardcontainer.innerHTML+ `<div data-folder="${folder}" class="card">
            <div class="play">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="green"/>
            <path d="M10 23V9L24 16L10 23Z" fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            
            </div>
            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>
                        <img src="/songs1/${folder}/cover.jpg" width="100px"  alt="Happy hits" srcset="">
                        <h2>${response.title}</h2>
                        <p>${response.description}
                        </p>
                        </div>`
                        
                    }
                }
                //             let e = { href: "http://example.com/path/to/resource" };
                // console.log(e.href.split("/").slice(-2)[0]);
                // e.href.split("/") results in ["http:", "", "example.com", "path", "to", "resource"].
                // .slice(-2) results in ["to", "resource"].
                // [0] selects the first element of ["to", "resource"], which is "to".
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            console.log(item.currentTarget);
            
            songs= await getsongs(`songs1/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0])
        })
    })
    // console.log(anchors);
    
    // console.log(div);
    
}
async function main(){

    await getsongs("songs1/ncs");
    // console.log(songs);
    playmusic(songs[2],true)
   //display all albums:
    displayalbums()
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="img/play.svg"
        }
        else{
            currentsong.pause()
            play.src="img/pause.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        
        
    })
    //adding eventlistner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent= (e.offsetX/e.target.getBoundingClientRect().width) *100
           document.querySelector(".circle").style.left= percent  +"%"
            currentsong.currentTime=(currentsong.duration * percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%"
    })
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        
        if((index+1) <= length){
            playmusic(songs[index+1])
        }
        
        
    })
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        
        if((index-1) >= 0){
            playmusic(songs[index-1])
        }
        
    })
    //adding volume functionality
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume=parseInt(e.target.value)/100
        if(currentsong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
        if(currentsong.volume==0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("volume.svg","mute.svg")
        }
        
    })
   document.querySelector(".volume>img").addEventListener("click",(e)=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src= e.target.src.replace("volume.svg","mute.svg")
        currentsong.volume=0
        document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }
    else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg")
        currentsong.volume=0.1
        document.querySelector(".range").getElementsByTagName("input")[0].value=10
    }
   })
    
}
main()


