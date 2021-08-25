import React from "react";
import "./Player.css";
import { Input, List, Avatar, Card} from 'antd';
import 'antd/dist/antd.css';
import play_btn from "./play.png";
import pause_btn from "./pause.png";
import next_btn from "./next.png";
import previous_btn from "./previous.png";
import add_to_library from "./addToLibrary.png"
const { Search } = Input;


const Player = props => {

  let is_playing = props.is_playing;

  const play_btn_func = (device) => {
        document.getElementById('play_btn_div').style.display = 'none'; 
        document.getElementById('pause_btn_div').style.display = 'block'; 
        is_playing = true;
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.the_token}`,
          }
        })
        .then(data => props.updateFunc(false))
    }
  const pause_btn_func = (device, updateBoolean) => {
        document.getElementById('pause_btn_div').style.display = 'none'; 
        document.getElementById('play_btn_div').style.display = 'block';
        is_playing = false;
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.the_token}`,
          }
        })
        .then(data => {
            if(updateBoolean){
                props.updateFunc(false);
            }
            else{
                props.clearQueue();
            }
        })
    }
  const next_btn_func = (device) => {
  /*
        fetch(`https://api.spotify.com/v1/me/player/next?device_id=${device}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.the_token}`,
          }
        })
        .then(data => props.nextFunc())
        */
        props.nextFunc();
    }
  const previous_btn_func = (device) => {
        //TODO: Fix Previous
        /*fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${device}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.the_token}`,
          }
        })
        .then(data => props.updateFunc(false))
        */
        props.prevFunc();
    }
  const add_to_library_btn_func = (track) => {
        fetch(`https://api.spotify.com/v1/me/tracks?ids=${track}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.the_token}`,
          }
        })
    }
  const add_playlist_btn_func = (playlist_name, user_id) => {
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
            'Authorization': `Bearer ${props.the_token}`,
          }
        })
        .then(response => response.json())
        .then(data => { 
            playlist_id = data.id;
            for (var i = 0; i < props.total_queue.length; i++){
                fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=spotify%3Atrack%3A${props.total_queue[i].id}`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.the_token}`,
                  }
                })
            }
        })
        .catch((error) => {console.log(error)});
    
  // const backgroundStyles = {
  //  backgroundImage:`url(${props.item.album.images[0].url})`,
  // };
        
  }

  const progressBarStyles = {
    width: (props.progress_ms * 100 / props.item.duration_ms) + '%'
  };

  let queue_card;
  if(props.next_queue.length > 0){
     //console.log("this is the next queue");
     //console.log(props.next_queue);
      queue_card = <Card style={{overflowY: "hidden", overflow: "visible", width: "100%", float: "left", backgroundColor: "#0000", height: "100%", border: "0", padding: "0", boxSizing: "border-box"}}>
                    <ul grid="{gutter: 16, column: 10}" style={{boxSizing: "border-box", display: "flex", flexDirection: "row", width: "100%", height: "100%", padding: "0"}}>
                      {props.next_queue}
                    </ul>
                   </Card>;
    //console.log(queue_card);
  }
  else {
      queue_card = <Card hidden={true}/>;
  }

  let played_queue_card;
  if(props.played_queue.length > 0){
     //console.log("this is the next queue");
     //console.log(props.next_queue);
      played_queue_card = <Card id="played_queue_card" style={{overflowY: "hidden", overflow: "visible", float: "right", backgroundColor: "#0000", height: "100%", border: "0", padding: "0", boxSizing: "border-box"}}>
                    <ul grid="{gutter: 16, column: 10}" style={{boxSizing: "border-box", display: "flex", flexDirection: "row", width: "100%", height: "100%", padding: "0"}}>
                      {props.played_queue.slice(0,-1)}
                    </ul>
                   </Card>;
    //console.log(queue_card);
  }
  else {
      played_queue_card = <Card hidden={true}/>;
  }


  return (
  <>
    {props.next ? (
    <div id="currentPlayer">
      <div  style={{height:"100%"}}>
         <div> 
             <Search
                        className="Search"
                        style={{margin: "auto", padding: "0", height: "10%", fontFamily: "Roboto", maxWidth: "85%", width: "700px"}} type="text" id="playlist_name" 
                        placeholder="Playlist Name"
                        enterButton="Save Session as Playlist"
                        onSearch={function(){add_playlist_btn_func(document.getElementById("playlist_name").value, props.user )}}
              />
          </div>
          <div className="main-wrapper">
            <div id="played_queue">
                {played_queue_card}
            </div>
            <div className="now-playing__side">
              <div style={{maxWidth: "100%", display: "flex", height: "75%", margin: "auto"}}>
                <img style={{maxWidth: "100%", maxHeight: "100%", margin: "auto"}} src={props.item.album.images[0].url}  alt="player" />
              </div>
              <svg viewBox="0 0 75 5" style={{overflow: "visible", float: "left", height:"10%"}}>
                <text x="0" y="100%" textLength="100%" fontSize=".25em">{props.item.name}</text>
              </svg>
              <svg viewBox="0 0 50 5" style={{overflow: "visible", float: "left", height:"5%", paddingBottom: "5px"}}>
                <text x="0" y="100%" textLength="100%" fontSize=".3em">{props.item.artists[0].name}</text>
              </svg>
              <div id="buttons">
                <img id="previous_btn_div" alt="previous song" className="button_img" src={previous_btn} onClick={function(){previous_btn_func(props.device)}}/>
                <img id="pause_btn_div" alt="pause song" className="button_img" src={pause_btn} style={{display: (!is_playing ? 'none' :'block')}} onClick={function(){pause_btn_func(props.device, true)}}/>
                <img id="play_btn_div" alt="play song" className="button_img" src={play_btn} style={{display: (is_playing ? 'none' :'block')}} onClick={function(){play_btn_func(props.device)}}/>
                <img id="forward_btn_div" alt="next song" className="button_img" src={next_btn} onClick={function(){next_btn_func(props.device)}}/>
                <img className="button_img" alt="add song to library" src={add_to_library} onClick={function(){add_to_library_btn_func(props.item.id)}}/>
              </div>
              <div className="progress">
                <div
                  className="progress__bar"
                  style={progressBarStyles}
                />
              </div>
            </div>
            <div id="queue">
                {queue_card}
            </div>
          </div>
      </div>
    </div>
        )
        :(<>
        <h3 style={{display: ((props.item.id === "") ? 'block' :'none')}}> Play a song to start your playlist:</h3>
        <h3 style={{display: ((props.item.id === "") ? 'none' :'block')}}> Current session detected, click refresh to load:</h3>
        </>)}
    </>
  );

}
export default Player;