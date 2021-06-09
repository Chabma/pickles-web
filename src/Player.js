import React from "react";
import "./Player.css";
import{play, playSong} from "./App"
import { Input, List, Avatar, Card } from 'antd';
import 'antd/dist/antd.css';
import play_btn from "./play.png";
import pause_btn from "./pause.png";
import next_btn from "./next.png";
import previous_btn from "./previous.png";
import add_to_library from "./addToLibrary.png"

const Player = props => {

  let is_playing = props.is_playing;


  const play_btn_func = (access_token, device) => {
        document.getElementById('play_btn_div').style.display = 'none'; 
        document.getElementById('pause_btn_div').style.display = 'block'; 
        is_playing = true;
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
    }
  const pause_btn_func = (access_token, device) => {
        document.getElementById('pause_btn_div').style.display = 'none'; 
        document.getElementById('play_btn_div').style.display = 'block';
        is_playing = false;
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
    }
  const next_btn_func = (access_token, device) => {
        fetch(`https://api.spotify.com/v1/me/player/next?device_id=${device}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
    }
  const previous_btn_func = (access_token, device) => {
        fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${device}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
    }
  const add_to_library_btn_func = (access_token, track) => {
        fetch(`https://api.spotify.com/v1/me/tracks?ids=${track}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
    }
  const add_playlist_btn_func = (access_token, playlist_name, user_id) => {
        console.log(playlist_name);
        let playlist_id = "";
        let data = {
              "name":  playlist_name,
              "description": "Made by Pickles, d'illest playlist creator web app",
              "public": false
          };
        fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
        .then(response => response.json())
        .then(data => { 
            playlist_id = data.id;
            for (var i = 0; i < props.total_queue.length; i++){
                fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=spotify%3Atrack%3A${props.total_queue[i]}`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                  }
                })
            }
        })
        .catch((error) => {console.log(error)});
    }

  const backgroundStyles = {
    backgroundImage:`url(${props.item.album.images[0].url})`,
  };

  const progressBarStyles = {
    width: (props.progress_ms * 100 / props.item.duration_ms) + '%'
  };

  let queue_card;
  if(props.next_queue.length > 0){
     console.log("this is the next queue");
    console.log(props.next_queue);
      queue_card = <Card>
        <List itemLayout="horizontal">
          {console.log("here")}
          {props.next_queue}
        </List>
      </Card>;
    console.log(queue_card);
    }
  else {
      queue_card = <Card hidden={true}/>;
  }


  console.log("THESE ARE THE PROPS");
  console.log(props);
  return (
    <div className="App" id="currentPlayer">
    {props.next && (
      <div className="main-wrapper">
        <div className="now-playing__img">
          <img src={props.item.album.images[0].url}  alt="player" />
        </div>
        <div className="now-playing__side">
          <div className="now-playing__name">{props.item.name}</div>
          <div className="now-playing__artist">
            {props.item.artists[0].name}
          </div>
          <div className="now-playing__status">
            {props.is_playing ? "Playing" : "Paused"}
          </div>
          <div id="buttons">
            <img src={previous_btn} onClick={function(){previous_btn_func(props.the_token, props.device)}}/>
            <img id="pause_btn_div" src={pause_btn} style={{display: (!is_playing ? 'none' :'block')}} onClick={function(){pause_btn_func(props.the_token, props.device)}}/>
            <img id="play_btn_div" src={play_btn} style={{display: (is_playing ? 'none' :'block')}} onClick={function(){play_btn_func(props.the_token, props.device)}}/>
            <img src={next_btn} onClick={function(){next_btn_func(props.the_token, props.device)}}/>
          </div>
          <div className="progress">
            <div
              className="progress__bar"
              style={progressBarStyles}
            />
          </div>
          <div id="buttons_two">
            <img src={add_to_library} onClick={function(){add_to_library_btn_func(props.the_token, props.item.id)}}/>
            <Input type="text" id="playlist_name" placeholder="Enter Playlist Name Here"></Input>
            <button onClick={function(){add_playlist_btn_func(props.the_token, document.getElementById("playlist_name").value, props.user )}}>Create a playlist from queue</button>          
          </div>
        </div>
      </div>
      )}
      <div id="queue">
        {queue_card}
      </div>
      <div id ="nextPlayer">
          {props.next && (
          <div>
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
          </div>
            )}
        </div>
    </div>
  );

}
export default Player;