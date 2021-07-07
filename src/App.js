import React, { Component } from "react";
import ReactDOM from 'react-dom';
//import hash from "./hash";
import logo from "./logo.png";
import refresh_btn from "./refresh.png";
import { Input, List, Avatar, Card } from 'antd';
import 'antd/dist/antd.css';
import "./App.css";
import * as $ from "jquery";
import Player from "./Player";
import NextPlayer from "./NextPlayer";
import 'particles.js/particles';


export const authEndpoint = 'https://accounts.spotify.com/authorize';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "fadd120c4e7a4a1a954bf081a4fd6e59";
const redirectUri = "http://localhost:3000/callback";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "app-remote-control",
  "streaming",
  "user-modify-playback-state",
  "user-library-modify",
  "playlist-modify-public",
  "playlist-modify-private",
];
const particlesJS = window.particlesJS;
const { Search } = Input;

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class App extends Component {

  constructor() {
    super();
    this.state = {
      token: null,
      item: {
       album: {
        images: [{ url: "" }]
       },
       name: "",
       artists: [{ name: "" }],
       duration_ms:0,
       id: "",
      },
      is_playing: false,
      progress_ms: 0,
      searchResults: [],
      next: null,
      next_queue: [],
      played_queue: [],
      total_queue: [],
      deviceID: "",
      userID: "",
  };
  this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
      if(data){  
          this.setState({
              item: data.item,
              is_playing: data.is_playing,
              progress_ms: data.progress_ms,
              searchResults: [],
              next: null,
              the_token: token, 
            });
       }
      },
      error: () =>{
            console.log("failure");
      }
    });
  }
  
  getSearchResults(query){
    const access_token = this.state.token;
    const searchQuery = query;
    console.log("Search Query: " + searchQuery.toString())
    const fetchURL = encodeURI(`q=${searchQuery}`);
    fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`     
        }
      }
    )
    .then(response => {
      if(!response.ok){
        throw Error("Response Not Ok")
      }
      return response;
    })
    .then(response => response.json())
    .then(({tracks}) => {
      console.log(tracks.items[0].name);
      const results = [];
      tracks.items.forEach(element => {
        let artists = []
        element.artists.forEach(artist => artists.push(artist.name))
        results.push(      
          <List.Item key={element.uri} onClick={() => {this.playSong(access_token, element.uri, element.album.images[0].url, element.id, element, element.artists)}}>
            <List.Item.Meta
              avatar={<Avatar shape='square' size='large' src={element.album.images[0].url} />}
              title={<p href="https://ant.design">{element.name}</p>}
              description={artists.join(', ')}
            />
          </List.Item>);
      });
      this.setState({
        searchResults: results
      });
    })
    .catch(error => this.setState({
        searchResults: []
      })
    )
  }

  queue = ({
      spotify_uri,
      device,
      info,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/queue?uri=${spotify_uri}&device_id=${this.state.deviceID}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
        .then(response => response.text())
        .then(data => this.getRecs(access_token, info.artists[0].id, info.genre, info.id, info ))
        .catch((error) => {console.log(error)});
      });
    };

    queueSong = (access_token, uri, img, info) => {

    let el = document.querySelector('.main-wrapper');
    if(el){
        el.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        el.scrollLeft += evt.deltaY;
    });
    }

    let player = new window.Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(access_token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      let temp = [];
      for( var i = 0; i < this.state.next_queue.length; i++){
        temp.push(this.state.next_queue[i]);
      }
      console.log("THIS IS THE ARTIST INFO THINGY")
      console.log(info);
      let artists = [];
      info.artists.forEach(artist => artists.push(artist.name));
      temp.push(      
          <List.Item key={uri} style={{height:"100%",border: "4px solid #0000"}}>
            <List.Item.Meta style={{display:"block"}}
              avatar={<Avatar shape='square' size='large' src={img} style={{height:"50%", width:"150px"}} />}
              title={<p href="https://ant.design">{info.name}</p>}
              description={artists.join(', ')}
            />
          </List.Item>);
      let temp_all = [];
      for( var i = 0; i < this.state.total_queue.length; i++){
        temp_all.push(this.state.total_queue[i]);
      }
      temp_all.push(      
          info.id);
        /* <List.Item key={uri}>
            <List.Item.Meta
              avatar={<Avatar shape='square' size='large' src={img} />}
            />
          </List.Item>);*/
      this.setState({
           next_queue: temp,
           total_queue: temp_all,
        })
      this.queue({
        /*playerInstance: new window.Spotify.Player({
          name: 'New Player',
          getOAuthToken: callback => {
            // Run code to get a fresh access token
            console.log(access_token);
            callback(access_token);
          },
          volume: 0.5
        })*/
        playerInstance: player,
        device: device_id,
        spotify_uri: uri,
        info: info
         });
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();

    console.log(player);
  }

  play = ({
      spotify_uri,
      device,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceID}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        })
        .then(response => response.text())
        .then(data => this.updatePlaying(access_token))
        .catch((error) => {console.log(error)});
      });
    };


  playLastSong = (access_token, uri, img, track_id, element, artist_list) => {
    let player = new window.Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(access_token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      let temp_all = [];
      for( var i = 0; i < this.state.total_queue.length; i++){
        temp_all.push(this.state.total_queue[i]);
      }
      temp_all.push(      
           track_id);
      let artists = []
      artist_list.forEach(artist => artists.push(artist.name))
      let temp_played = [];
      temp_played.push(
        <List.Item key={uri} style={{height:"100%",border: "4px solid #0000"}}>
            <List.Item.Meta style={{display:"block"}}
              avatar={<Avatar shape='square' size='large' src={img} style={{height:"50%", width:"150px"}} />}
              title={<p href="https://ant.design">{element.name}</p>}
              description={artists.join(', ')}
            />
        </List.Item>);
      this.setState({
           total_queue: temp_all, 
           played_queue: temp_played,
        })
      this.play({
        /*playerInstance: new window.Spotify.Player({
          name: 'New Player',
          getOAuthToken: callback => {
            // Run code to get a fresh access token
            console.log(access_token);
            callback(access_token);
          },
          volume: 0.5
        })*/
        playerInstance: player,
        device: device_id,
        spotify_uri: uri,
         });
    });

  playSong = (access_token, uri, img, track_id, element, artist_list) => {
    let player = new window.Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(access_token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      let temp_all = [];
      for( var i = 0; i < this.state.total_queue.length; i++){
        temp_all.push(this.state.total_queue[i]);
      }
      temp_all.push(      
           track_id);
      let artists = []
      artist_list.forEach(artist => artists.push(artist.name))
      let temp_played = [];
      temp_played.push(
        <List.Item key={uri} style={{height:"100%",border: "4px solid #0000"}}>
            <List.Item.Meta style={{display:"block"}}
              avatar={<Avatar shape='square' size='large' src={img} style={{height:"50%", width:"150px"}} />}
              title={<p href="https://ant.design">{element.name}</p>}
              description={artists.join(', ')}
            />
        </List.Item>);
      this.setState({
           total_queue: temp_all, 
           played_queue: temp_played,
        })
      this.play({
        /*playerInstance: new window.Spotify.Player({
          name: 'New Player',
          getOAuthToken: callback => {
            // Run code to get a fresh access token
            console.log(access_token);
            callback(access_token);
          },
          volume: 0.5
        })*/
        playerInstance: player,
        device: device_id,
        spotify_uri: uri,
         });
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();

    console.log(player);
  }

  updatePlaying = (token) => {
    // Make a call using the token
    let el = document.querySelector('.main-wrapper');
    if(el){
        el.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        el.scrollLeft += evt.deltaY;
    });
    }
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
      console.log("success!");
      console.log("thisthis.state.next_queue is the data = " + data)
      if(data){ 
        console.log(data);
        this.setState({
           item: data.item,
           is_playing: data.is_playing,
           progress_ms: data.progress_ms,
        })
        this.getRecs(token, data.item.artists[0].id, data.item.genre, data.item.id, data); 
       }
      },
      error: () =>{
            console.log("failure");
      }
    });
  }

  getRecs = (token, artist, genre, track, info) => {
    let tracks_string = this.state.total_queue.slice(-4).join();
    console.log(this.state.total_queue);
    let test_genre = [
      ""];
    $.ajax({
      url: `https://api.spotify.com/v1/recommendations?limit=3&seed_artists=${artist}&seed_genres=${test_genre}&seed_tracks=${tracks_string}`,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
      console.log("success!");
      console.log("this is the recommendations data = " + data);
      console.log(data);
      console.log(this.state.next_queue);
        if(data){ 
            this.setState({
              next: data.tracks,
              the_token: token, 
            })
            console.log(data.tracks);
        /*
        ReactDOM.render(<Player 
              item={info.item}
              is_playing={info.is_playing}
              progress_ms={info.progress_ms}
              next={data.tracks}
              the_token={token}
            />, document.getElementById('currentPlayer'))
        */
        }
      },
      error: () =>{
            console.log("failure");
      }
    });
 }

  componentDidMount() {
   //particles.js github page says to load package like so:
    particlesJS.load('particles-js', '/assets/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token)
    }
    this.timerID = setInterval(
      () => this.tick(_token),
      1000
    );
  }
  

  nextQueue = (token) =>{
        let temp_list = []
        for( var i = 1; i < this.state.next_queue.length; i++){
            temp_list.push(this.state.next_queue[i]);
        }
        let temp_list_played = this.state.played_queue;
        temp_list_played.push(this.state.next_queue[0]);
        this.setState({
            next_queue: temp_list,
            played_queue: temp_list_played,
            progress_ms: 0
        })
        let el = document.querySelector('.main-wrapper');
        let el2 = document.querySelector('#played_queue_card');
        if(el){
            el.scrollLeft = el2.offsetWidth - (window.innerWidth  * .3) ;
        }
        this.updatePlaying(token)
  }


  tick(token){
      if(this.state.is_playing){
        let temp = this.state.progress_ms + 1000;
        if(this.state.progress_ms > this.state.item.duration_ms){
            this.nextQueue(token);
        }
        else{
            this.setState({
                progress_ms: temp
            })
        }
      }
 }




render() {
  window.onSpotifyWebPlaybackSDKReady = () => {
      const token = this.state.token;
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        this.setState({
         deviceID: device_id
      })
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();

      fetch(`https://api.spotify.com/v1/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.token}`,
      }
      })
      .then(response => response.json())
      .then(data => 
      {
      this.setState({
          userID: data.id
      });
      }
      )
      .catch((error) => {console.log(error)});
  
  };

  let card;
  if(this.state.searchResults.length > 0){
      console.log("these are the search results");
      console.log(this.state.searchResults);
      card = <Card >
        <List itemLayout="horizontal">
          {this.state.searchResults}
        </List>
      </Card>;
    }
  else {
      card = <Card hidden={true}/>;
  }
  return (
    <div className="App" >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <div id="particles-js">
      </div>
          <div className="App-header">
                <div id="header" style={{width: "100%", height: "50px", backgroundColor: "#b4bfcc55"}}>
        <img style={{float: "left", height: "100%"}} src={logo}alt="logo" />
        <h3 style={{top: "0", float: "left", margin: "auto"}} >Pickles</h3>
      </div>
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            <div style={{zIndex: 10, width: "100%", height: "100%"}}>
                <Player 
                  item={this.state.item}
                  is_playing={this.state.is_playing}
                  progress_ms={this.state.progress_ms}
                  next={this.state.next}
                  next_queue={this.state.next_queue}
                  played_queue={this.state.played_queue}
                  the_token={this.state.token}
                  func={this.queueSong}
                  updateFunc={this.updatePlaying}
                  nextFunc={this.nextQueue}
                  device={this.state.deviceID}
                  user={this.state.userID}
                  total_queue={this.state.total_queue}
                />
                <NextPlayer
                  item={this.state.item}
                  is_playing={this.state.is_playing}
                  progress_ms={this.state.progress_ms}
                  next={this.state.next}
                  next_queue={this.state.next_queue}
                  the_token={this.state.token}
                  func={this.queueSong}
                  device={this.state.deviceID}
                  user={this.state.userID}
                  total_queue={this.state.total_queue}
                />
                <div id ="refresh_btn_div"  style={{display: (this.state.item.id == "" ? 'none' :'block')}}>
                    <img id="refresh_btn" src={refresh_btn} onClick={() => {this.updatePlaying(this.state.token)}}/>
                </div>
                <div className="Search"><Input
                    placeholder="Search for a song"
                    size="large"
                    onChange={value => this.getSearchResults(value.target.value)}
                    />
                    {card}
                </div>
            </div>
          )}
          </div>
    </div>
  );
  }
}
export default App;