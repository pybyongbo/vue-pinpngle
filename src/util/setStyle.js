import localStorage from "./storage";

const skin = {};

let getSkinStyle = (skin) => {
    if (!skin) {
        return "";
    }
    if (skin === 'three') {
        return `
        .play-page .play-area .piece {
            position: absolute;
            left: 0;
            top: 0;
            width: 28vw;
            height: 20vh;
            border: 1px solid transparent;
            background-repeat: no-repeat;
            background-size: 84vw 60vh;
            transition: transform 0.6s ease-in-out;
        }
        .play-page .play-area .piece-0 {
        background-position: 0 0;
        }

        .play-page .play-area .piece-1 {
        background-position: -28vw 0;
        }

        .play-page .play-area .piece-2 {
        background-position: -56vw 0;
        }

        .play-page .play-area .piece-3 {
        background-position: 0 -20vh;
        }

        .play-page .play-area .piece-4 {
        background-position: -28vw -20vh;
        }

        .play-page .play-area .piece-5 {
        background-position: -56vw -20vh;
        }

        .play-page .play-area .piece-6 {
        background-position: 0 -40vh;
        }

        .play-page .play-area .piece-7 {
        background-position: -28vw -40vh;
        }

        .play-page .play-area .piece-8 {
        background-position: -56vw -40vh;
        }
        `;
    } else if(skin==='four') {
        return `
            .play-page .play-area .piece {
                position: absolute;
                left: 0;
                top: 0;
                width:21vw;
                height: 15vh;
                border: 1px solid transparent;

                background-repeat: no-repeat;
                background-size: 84vw 60vh;
                transition: transform 0.6s ease-in-out;
            }
            .play-page .play-area .piece-0 {
                background-position: 0 0;
            }
            .play-page .play-area .piece-1 {
                background-position: -21vw 0;
            }
            .play-page .play-area .piece-2 {
                background-position: -42vw 0;
            }
            .play-page .play-area .piece-3 {
                background-position:-63vw 0;
            }
            .play-page .play-area .piece-4 {
                background-position: 0vw -15vh;
            }
            
            
            .play-page .play-area .piece-5 {
                background-position: -21vw -15vh;
            }
            
            .play-page .play-area .piece-6 {
                background-position: -42vw -15vh;
            }
            
            .play-page .play-area .piece-7 {
                background-position: -63vw -15vh;
            }
            
            .play-page .play-area .piece-8 {
                background-position: -0vw -30vh;
            }
            
            .play-page .play-area .piece-9 {
                background-position: -21vw -30vh;
            }
            
            .play-page .play-area .piece-10 {
                background-position: -42vw -30vh;
            }
            
            .play-page .play-area .piece-11 {
                background-position: -63vw -30vh;
            }
            
            .play-page .play-area .piece-12 {
                background-position: -0vw -45vh;
            }
            
            .play-page .play-area .piece-13 {
                background-position: -21vw -45vh;
            }
            
            .play-page .play-area .piece-14 {
                background-position: -42vw -45vh;
            }
            .play-page .play-area .piece-15 {
                background-position: -63vw -45vh;
            }
        `
    }
};

let setSkinStyle = (skin) => {
    let styleText = getSkinStyle(skin);
    let oldStyle = document.getElementById("skin");
    const style = document.createElement("style");
    style.id = "skin";
    // style.type = "text/css";
    style.innerHTML = styleText;
    oldStyle ? document.head.replaceChild(style, oldStyle) : document.head.appendChild(style);
};
// console.log(112,skin[localStorage.getSkin()]);
// 设置皮肤
skin[localStorage.getSkin()] && setSkinStyle(skin[localStorage.getSkin()]);

export { skin, setSkinStyle }
