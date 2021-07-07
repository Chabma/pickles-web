import React from "react";
import "./Player.css";
import { Input, List, Avatar, Card } from 'antd';
import 'antd/dist/antd.css';
import play_btn from "./play.png";
import pause_btn from "./pause.png";
import next_btn from "./next.png";
import previous_btn from "./previous.png";
import add_to_library from "./addToLibrary.png"
const { Search } = Input;

const NextPlayer = props => {
return (
    <div id ="nextPlayer">
       {props.next && (
          <React.Fragment>
              <div className="next-wrapper" onClick={function(){props.func(props.the_token, props.next[0].uri, props.next[0].album.images[0].url, props.next[0])}}>
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
              <div className="next-wrapper" onClick={function(){props.func(props.the_token, props.next[1].uri, props.next[1].album.images[0].url, props.next[1])}}>
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
              <div className="next-wrapper" onClick={function(){props.func(props.the_token, props.next[2].uri, props.next[2].album.images[0].url, props.next[2])}}>
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