import React from "react";
import "./Player.css";
import 'antd/dist/antd.css';

const NextPlayer = props => {
return (
    <div id ="nextPlayer">
       {props.next && (
          <React.Fragment>
              <div className="next-wrapper" onClick={function(){props.queueFunc(props.next[0], props.total_queue.length)}}>
                <div className="next-playing__img">
                  <img src={props.next[0].album.images[0].url}  alt="player" />
                </div> 
                <div className="next-playing__side">
                  <div className="next-playing__name">{props.next[0].name}</div>
                  <div className="next-playing__artist">
                    {props.next[0].artists[0].name}
                  </div>
                </div>
              </div>
              <div className="next-wrapper" onClick={function(){props.queueFunc(props.next[1], props.total_queue.length)}}>
                <div className="next-playing__img">
                  <img src={props.next[1].album.images[0].url}  alt="player" />
                </div>
                <div className="next-playing__side">
                  <div className="next-playing__name">{props.next[1].name}</div>
                  <div className="next-playing__artist">
                    {props.next[1].artists[0].name}
                  </div>
                </div>
              </div>
              <div className="next-wrapper" onClick={function(){props.queueFunc(props.next[2], props.total_queue.length)}}>
                <div className="next-playing__img">
                  <img src={props.next[2].album.images[0].url}  alt="player" />
                </div>
                <div className="next-playing__side">
                  <div className="next-playing__name">{props.next[2].name}</div>
                  <div className="next-playing__artist">
                    {props.next[2].artists[0].name}
                  </div>
                </div>
              </div> 
          </React.Fragment>
       )}
    </div>
 )}

 export default NextPlayer;