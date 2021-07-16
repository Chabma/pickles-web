import React, { Component } from "react";
//import ReactDOM from 'react-dom';
//import hash from "./hash";
import logo from "./logo.png";
import refresh_btn from "./refresh.png";
import { Input, List, Avatar, Card } from 'antd';
import {SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "./App.css";
import play_btn from "./play.png";
import add_start_queue from "./add_start_queue.png";
import add_end_queue from "./add_end_queue.png";
import * as $ from "jquery";
import Player from "./Player";
import NextPlayer from "./NextPlayer";
import 'particles.js/particles';


export const authEndpoint = 'https://accounts.spotify.com/authorize';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "fadd120c4e7a4a1a954bf081a4fd6e59";
const redirectUri = "https://chabma.github.io/pickles-web/#/callback";
//const redirectUri = "http://localhost:3000/callback";
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

// Get the hash of the url
const hash = window.location.hash
  .substring(2)
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
      player: null,
      deviceID: "",
      searchValue: "",
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
      queue_pos: 0,
      userID: "",
  };
  }
  
  getSearchResults(query){
    const access_token = this.state.token;
    const searchQuery = query;
    //console.log("Search Query: " + searchQuery.toString())
    const fetchURL = encodeURI(`q=${searchQuery}`);
    fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`     
        }
    })
    .then(response => {
      if(!response.ok){
        throw Error("Response Not Ok")
      }
      return response;
    })
    .then(response => response.json())
    .then(({tracks}) => {
      //console.log(tracks.items[0].name);
      const results = [];
      tracks.items.forEach(element => {
        let artists = []
        element.artists.forEach(artist => artists.push(artist.name))
        results.push(      
          <List.Item key={element.uri} 
                    // onClick={() => {
                    //    this.playSong(element.uri, element.album.images[0].url, element.id, element, element.artists)
                    // }}
                    actions={[
                        <img id="list_play_btn" alt="play song" src={play_btn} style={{display: 'block', width: "30px"}} onClick={() => {this.setState({ searchValue: "", searchResults: []  }); this.playSong(element.uri, element.album.images[0].url, element.id, element, element.artists);}}/>,
                        <img id="list_queue_start_btn" alt="add song to start of queue" src={add_start_queue} style={{width: "30px", display: (this.state.is_playing ? 'block' :'none')}} onClick={() =>{this.queueSongStart(element.uri, element.album.images[0].url, element)}}/>,
                        <img id="list_queue_end_btn" alt="add song to end of queue" src={add_end_queue} style={{width: "30px", display: (this.state.is_playing ? 'block' :'none')}} onClick={() => {this.queueSong(element.uri, element.album.images[0].url, element)}}/>
                    ]}
                    >
            <List.Item.Meta
              avatar={<Avatar shape='square' size='large' src={element.album.images[0].url} />}
              title={<p href="https://ant.design">{element.name}</p>}
              description={artists.join(', ')}
            />
          </List.Item>
        );
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
      info
  }) => {
    this.state.player._options.getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/queue?uri=${spotify_uri}&device_id=${this.state.deviceID}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        })
        .then(response => response.text())
        .then(data => this.getRecs(info.artists[0].id, info.genre, info.id, info ))
        .catch((error) => {console.log(error)});
    });
  };

  queueSong = (uri, img, info) => {
    // Scroll so that current item is in the middle
    let el = document.querySelector('.main-wrapper');
    if(el){
        el.addEventListener("wheel", (evt) => {
            if (evt.deltaY < 0){
                if(el.scrollLeft != 0){
                    evt.preventDefault();
                    el.scrollLeft += (evt.deltaY * 0.03);
                }
            }
            else{
                if(el.scrollLeft < el.scrollWidth - el.clientWidth){
                    evt.preventDefault();
                    el.scrollLeft += (evt.deltaY * 0.03);
                }
            }
        });
    }

    // set up next_queue
    let temp = [];
    for( var i = 0; i < this.state.next_queue.length; i++){
        temp.push(this.state.next_queue[i]);
    }
    //console.log("THIS IS THE ARTIST INFO THINGY")
    //console.log(info);
    let artists = [];
    info.artists.forEach(artist => artists.push(artist.name));
    temp.push(      
        <List.Item key={uri.concat('-', Date.now.toString())} style={{height:"100%",border: "4px solid #0000"}}>
            <List.Item.Meta style={{display:"block"}}
              avatar={<Avatar shape='square' size='large' src={img} style={{height:"50%", width:"150px"}} />}
              title={<p href="https://ant.design">{info.name}</p>}
              description={artists.join(', ')}
            />
        </List.Item>);

    // set up total_queue
    let temp_all = [];
    for( var j = 0; j < this.state.total_queue.length; j++){
        temp_all.push(this.state.total_queue[j]);
    }
    temp_all.push({"uri": uri, "id": info.id});

    this.setState({
        next_queue: temp,
        total_queue: temp_all,
    })
    
    this.getRecs(info.artists[0].id, info.genre, info.id, info )
    //this.queue({
    //    device: this.state.device_id,
    //    spotify_uri: uri,
    //    info: info
    //});
  }

    queueSongStart = (uri, img, info) => {
    // Scroll so that current item is in the middle
    let el = document.querySelector('.main-wrapper');
    if(el){
        el.addEventListener("wheel", (evt) => {
            if (evt.deltaY < 0){
                if(el.scrollLeft != 0){
                    evt.preventDefault();
                    el.scrollLeft += (evt.deltaY * 0.03);
                }
            }
            else{
                if(el.scrollLeft < el.scrollWidth - el.clientWidth){
                    evt.preventDefault();
                    el.scrollLeft += (evt.deltaY * 0.03);
                }
            }
        });
    }

    // set up next_queue
    let temp = [];
    for( var i = 0; i < this.state.next_queue.length; i++){
        temp.push(this.state.next_queue[i]);
    }

    let artists = [];
    info.artists.forEach(artist => artists.push(artist.name));
    temp.unshift(      
        <List.Item key={uri} style={{height:"100%",border: "4px solid #0000"}}>
            <List.Item.Meta style={{display:"block"}}
              avatar={<Avatar shape='square' size='large' src={img} style={{height:"50%", width:"150px"}} />}
              title={<p href="https://ant.design">{info.name}</p>}
              description={artists.join(', ')}
            />
        </List.Item>
    );

    // set up total_queue
    let temp_all = [];
    for( var j = 0; j < this.state.total_queue.length; j++){
        temp_all.push(this.state.total_queue[j]);
        if(j === this.state.queue_pos){
            temp_all.push({"uri": uri, "id": info.id});
        }
    }


    this.setState({
        next_queue: temp,
        total_queue: temp_all,
    })
    
    this.getRecs(info.artists[0].id, info.genre, info.id, info )
    //this.queue({
    //    device: this.state.device_id,
    //    spotify_uri: uri,
    //    info: info
    //});
  }

  nextQueue = () =>{
        //update queue position
        let new_pos = this.state.queue_pos + 1;
        
        if(this.state.total_queue.length > new_pos){
            //update next queue
            let temp_list = []
            for( var i = 1; i < this.state.next_queue.length; i++){
                temp_list.push(this.state.next_queue[i]);
            }

            //update previous queue
            let temp_list_played = this.state.played_queue;
            temp_list_played.push(this.state.next_queue[0]);


        
            //push updates
            this.setState({
                next_queue: temp_list,
                played_queue: temp_list_played,
                progress_ms: 0,
                queue_pos: new_pos,
            })

            //update queue scroll to keep now playing in the middle
            let el = document.querySelector('.main-wrapper');
            let el2 = document.querySelector('#played_queue_card');
            if(el){
                if(el2.offsetWidth >  (window.innerWidth  * .3)){
                    el.scrollLeft = el2.offsetWidth - (window.innerWidth  * .3);
                }
                else{
                    el.scrollLeft = el2.offsetWidth;
                }
            }

            //play new song
            this.play({spotify_uri: this.state.total_queue[new_pos].uri});

        }

        this.updatePlaying(true);
  }
  
  play = ({
    spotify_uri
  }) => {

    console.log("this is the uri");
    console.log(spotify_uri);
    this.state.player._options.getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceID}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        })
        .then(response => response.text())
        .then(data => this.updatePlaying(true))
        .catch((error) => {console.log(error)});
    });
  };

  playSong = (uri, img, track_id, element, artist_list) => {
      let temp_all = [];
      for( var i = 0; i < this.state.total_queue.length; i++){
        temp_all.push(this.state.total_queue[i]);
      }

      temp_all.push({"uri": uri, "id": track_id});
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
        </List.Item>
      );

      this.setState({
           total_queue: temp_all, 
           played_queue: temp_played,
      })

      this.play({
        spotify_uri: uri
      });
  }

  clearQueue = () => {
    this.setState({
      searchValue: "",
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
      queue_pos: 0,
    })
  }

  playPreviousSong = () => {
    // set previous song to current Item
    // set next song to current Item
    // set previous to have one less item  


    if(this.state.queue_pos > 0){
        // set up previous_queue
        let temp_list = []
        for( var i = 0; i < this.state.played_queue.length - 1; i++){
            temp_list.push(this.state.played_queue[i]);
        }

    
        // set up next_queue
        let temp = [];
        for( var i = 0; i < this.state.next_queue.length; i++){
            temp.push(this.state.next_queue[i]);
        }
        //console.log("THIS IS THE ARTIST INFO THINGY")
        //console.log(info);
        let artists = [];
        this.state.item.artists.forEach(artist => artists.push(artist.name));
        temp.unshift(      
            <List.Item key={this.state.item.uri} style={{height:"100%",border: "4px solid #0000"}}>
                <List.Item.Meta style={{display:"block"}}
                  avatar={<Avatar shape='square' size='large' src={this.state.item.album.images[0].url} style={{height:"50%", width:"150px"}} />}
                  title={<p href="https://ant.design">{this.state.item.name}</p>}
                  description={artists.join(', ')}
                />
            </List.Item>);

        // set up current item
        let new_pos = this.state.queue_pos - 1;

        this.setState({
            next_queue: temp, 
            played_queue: temp_list,    
            progress_ms: 0,
            queue_pos: new_pos
        })

        this.play({spotify_uri: this.state.total_queue[new_pos].uri})
    }
  }

  updatePlaying = (refreshSelections, setItemBoolean=true) => {
    // Make a call using the token
    let el = document.querySelector('.main-wrapper');
    if(el){
        el.addEventListener("wheel", (evt) => {
            if (evt.deltaY < 0){
                if(el.scrollLeft != 0){
                    evt.preventDefault();
                    el.scrollLeft += (evt.deltaY * 0.03);
                }
            }
            else{
                if(el.scrollLeft < el.scrollWidth - el.clientWidth){
                    evt.preventDefault();
                    el.scrollLeft += (evt.deltaY * 0.03);
                }
            }
        });
    }
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      success: (data) => {
          console.log("success!");
          console.log("this.state.next_queue is the data = " + data)
          if(data){ 
            if(setItemBoolean){
                this.setState({
                   item: data.item,
                   is_playing: data.is_playing,
                   progress_ms: data.progress_ms,
                })
            }
            if(refreshSelections){
                this.getRecs(data.item.artists[0].id, data.item.genre, data.item.id, data);
            }
          }
      },
      error: () =>{
        console.log("failure");
      }
    });
  }

  getRecs = (artist, genre, track, info) => {
    let tracks_string = this.state.total_queue.map(a => a.id).slice(-4).join();
    console.log(this.state.total_queue);
    let test_genre = [""];
    $.ajax({
      url: `https://api.spotify.com/v1/recommendations?limit=3&seed_artists=${artist}&seed_genres=${test_genre}&seed_tracks=${tracks_string}`,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      success: (data) => {
      console.log("success!");
      console.log("this is the recommendations data = " + data);
      console.log(data);
      console.log(this.state.next_queue);
        if(data){ 
            this.setState({
              next: data.tracks,
              the_token: this.state.token, 
            })
            console.log(data.tracks);
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
      this.updatePlaying(true);
    }
    this.timerID = setInterval(
      () => this.tick(_token),
      1000
    );
  }

  tick(){
    if(this.state.is_playing){
        let temp = this.state.progress_ms + 1000;
        if(this.state.progress_ms > this.state.item.duration_ms){
            this.nextQueue(this.state.token);
        }
        else{
            this.setState({
                progress_ms: temp
            })
        }
    }
  }

  render() {
    // Start app
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = this.state.token;
        let player = new window.Spotify.Player({
            name: 'Pickles Web Player',
            getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => { this.updatePlaying(false, false); });

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
        .then(data => {
            this.setState({
                userID: data.id,
                player: player
            });
        })
        .catch((error) => {console.log(error)});
    };

    // <div id="header" style={{width: "100%", height: "50px", backgroundColor: "#b4bfcc55"}}>
    //    <img style={{float: "left", height: "100%"}} src={logo}alt="logo" />
    //    <h3 style={{top: "0", float: "left", margin: "auto"}} >Pickles</h3>
    // </div>

    // Show search results
    let card;
    if(this.state.searchResults.length > 0){
      //console.log("these are the search results");
      //console.log(this.state.searchResults);
        card = <Card>
                <List itemLayout="horizontal">
                  {this.state.searchResults}
                </List>
             </Card>;
    }
    else {
        card = <Card hidden={true}/>;
    }
    return ( 
      <div className="App">
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet"/>
        <div id="particles-js"></div>
        <div className="App-header">

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
                      updateFunc={this.updatePlaying}
                      nextFunc={this.nextQueue}
                      prevFunc={this.playPreviousSong}
                      device={this.state.deviceID}
                      user={this.state.userID}
                      total_queue={this.state.total_queue}
                      clearQueue={this.clearQueue}
                  />
                  <NextPlayer
                      item={this.state.item}
                      is_playing={this.state.is_playing}
                      progress_ms={this.state.progress_ms}
                      next={this.state.next}
                      next_queue={this.state.next_queue}
                      func={this.queueSong}
                      device={this.state.deviceID}
                      user={this.state.userID}
                  />
                  <div id ="refresh_btn_div"  style={{display: (this.state.item.id === "" ? 'none' :'block'), float: (this.state.item.id === "" ? 'none' :'left'), margin: 'auto' }}>
                      <img id="refresh_btn" alt="refresh recommendations" src={refresh_btn} onClick={() => {this.updatePlaying(true)}}/>
                  </div>
                  <div className="Search">
                      <Input
                          id="searchInput" 
                          style={{fontFamily: "Roboto"}}
                          placeholder="Search for a song"
                          size="large"
                          onChange={value => {this.setState({searchValue: value.target.value}); this.getSearchResults(value.target.value)}}
                          allowClear={true}
                          value={this.state.searchValue}
                          prefix={<SearchOutlined className="searchg-form-icon" />}
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