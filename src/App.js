import React, { Component } from "react";
import { Input, List, Avatar, Card, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "./App.css";
import * as $ from "jquery";
import Player from "./Player";
import NextPlayer from "./NextPlayer";
import SearchItem from "./SearchItem";
import logo from "./images/logo.png";
import refresh_btn from "./images/refresh.png";
import 'particles.js/particles';

// Spotify info
export const authEndpoint = 'https://accounts.spotify.com/authorize';
export const tokenEndpoint = "https://accounts.spotify.com/api/token";
const clientId = "fadd120c4e7a4a1a954bf081a4fd6e59";
const clientSecret = "97c1d3b88b9e4a89898482bb4141b2df";
//TODO: change uses of client Secret to Base 64 encoded uses
const redirectUri = "https://chabma.github.io/pickles-web/";  
//const redirectUri = "http://localhost:3000/callback";
//^^ redirect URI for local testing

const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-private",
  "user-read-email",
  "app-remote-control",
  "streaming",
  "user-modify-playback-state",
  "user-library-modify",
  "playlist-modify-public",
  "playlist-modify-private",
];

// set up particlesJS
const particlesJS = window.particlesJS;
console.log(window.location);

// get the code from the url;
const code = window.location.search
    .split("?")
    .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

class App extends Component {

  constructor() {
    super();
    this.state = {
      token: null,
      code: null,
      refresh_token: null,
      player: null,
      deviceID: "",
      searchValue: "",
      searchResults: [],
      is_playing: false,
      progress_ms: 0,
      total_queue: [],
      queue_pos: 0,
      userID: "",
      next: null,
      current_time: Date.now()
    };
  }
  
  getSearchResults(query){
  /*
  Create search items and then add to state total queue
  */
    const searchQuery = query;
    const fetchURL = encodeURI(`q=${searchQuery}`);

    //search with spotify api
    fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track`, {
        method: "GET",
        headers: { Authorization: `Bearer ${this.state.token}` }
    })
    .then(response => {
      if(!response.ok){ throw Error("Response Not Ok") }
      return response;
    })
    .then(response => response.json())
    .then(({tracks}) => {
      //create an item for each search result
      const results = [];
      tracks.items.forEach(element => {
        let artists = [];
        element.artists.forEach(artist => artists.push(artist.name));

        results.push(
          <SearchItem
            element={element}
            artists={artists}
            queue_pos={this.state.queue_pos}
            total_queue={this.state.total_queue}
            setFunc={(value, results) => {
                this.setState({
                    searchValue: value,
                    searchResults: results
                })
            }}
            playFunc={this.play}
            queueFunc={this.queue}
          />
        );
      });

      //update search results
      this.setState({
        searchResults: results
      });
    })
    .catch(error => this.setState({
        searchResults: []
    }))  
  }
  
  queue = (track, position, playBoolean = false) => {
  /*
  Create new item and add item to state's total queue 
  (updates via a call to getRecs?)
  */
    //enable Horizontal Scroll
    this.enableHorizontalScroll();

    //create new item
    let artists = track.artists.map(item => item.name);
    let item = {
        "uri": track.uri, 
        "id": track.id,
        "songDuration": track.duration_ms,
        "name": track.name,
        "artists": track.artists, 
        "image": track.album.images[0],
        "item": <List.Item key={track.uri.concat('-', Date.now.toString())}
                    style={{height:"100%",border: "4px solid #0000"}}>
                    <List.Item.Meta style={{display:"block"}}
                      avatar={<Avatar shape='square' size='large'
                      src={track.album.images[0].url}
                      style={{height:"50%", width:"150px"}}
                    />}
                      title={<p href="https://ant.design">{track.name}</p>}
                      description={artists.join(', ')}
                    />
                </List.Item>
    } 

    //add item to total_queue
    let tempQueue = [...this.state.total_queue.slice(0, position)];
    tempQueue.push(item);
    tempQueue = [...tempQueue, ...this.state.total_queue.slice(position)];
    
    this.setState({total_queue: tempQueue},
    () =>{
        if(playBoolean){
            this.play(position);
        }
    });   

    //update queue scroll to keep now playing in the middle
    //TODO: determine if this is needed
    this.getRecs(track.artists[0].id, track.id);
  }

  play = (queuePosition=this.state.queue_pos) => {
  /*
  Call spotify api to play song via current web player (calls update playing function)
  */
    if(queuePosition >= 0){
        if(queuePosition >= this.state.total_queue.length){
            this.queue(this.state.next[0], this.state.total_queue.length, true);
        }
        else{
            this.state.player._options.getOAuthToken(access_token => {
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceID}`,{
                    method: 'PUT',
                    body: JSON.stringify({ uris: [this.state.total_queue[queuePosition]?.uri] }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    }
                })
                .then(response => response.text())
                .then(data => {
                    this.setState({queue_pos: queuePosition});
                    this.updatePlaying(true);
                })
                .catch((error) => {console.log(error)});
            });
        }
    }
  }; 

  updatePlaying = (refreshSelections, setItemBoolean=true) => {
  /*
  Update's current state based on spotify api 
  (updates via a call to get Recs?)
  */

    this.enableHorizontalScroll();

    //update player info based on spotify's latest info
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      success: (data) => {
        if(setItemBoolean){
            this.setState({
                deviceID: data?.device.id ?? this.state.deviceID,
                is_playing: data?.is_playing ?? this.state.is_playing,
                progress_ms: data?.progress_ms ?? this.state.progress_ms,
            })
            console.log(data?.is_playing); 
        }
        if(refreshSelections){
            this.getRecs(data?.item.artists[0].id, data?.item.id);
        }
        this.updateScrollPosition();
      },
      error: (e) =>{
        console.log("Failure getting player info");
        console.log(e.responseText);
      }
    });
  }

  getRecs = (artist, track) => {
  /*
  Calls recomendation api with last 5 songs and updates the three recommendations
  */
    let tracks_string = this.state.total_queue.map(a => a.id).slice(-1).join('');
    tracks_string = `${track},${tracks_string}`;

    $.ajax({
      url: `https://api.spotify.com/v1/recommendations?limit=3&seed_artists=${artist}&seed_genres=%20&seed_tracks=${tracks_string}`,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      success: (data) => {
        if(data){ 
            //update recommendations
            this.setState({
              next: data.tracks,
            })
        }
      },
      error: () =>{
            console.log("Failure loading recommendations");
      }
    });
  }

  tick(){
  /*
  Called every second to inch forward progress bar and check if the spotify token should be refreshed
  */
    // check if next song should play
    if(this.state.is_playing){
        let nextSecond = this.state.progress_ms + 1000;
        let currentSongDuration = this.state.total_queue[this.state.queue_pos]?.songDuration; 
        
        if(nextSecond > currentSongDuration){
            this.play(this.state.queue_pos + 1);
        }
        else{
            this.setState({
                progress_ms: nextSecond
            })
        }
    }

    // check for token refresh
    if(Date.now() - this.state.current_time > 1800000){
        this.setState({
                current_time: Date.now()
        })
        this.refreshToken(0);
    }
  }

  clearQueue = () => {
  /*
  Cleared state variables associated with songs in the player
  */
    this.setState({
      searchValue: "",
      is_playing: false,
      progress_ms: 0,
      searchResults: [],
      next: null,
      total_queue: [],
      queue_pos: 0,
    })
  }

  enableHorizontalScroll = () => {
  /*
  Adds horizontal Scroll to player window
  TODO: confirm this is only called once
  */
    let el = document.querySelector('.main-wrapper');
    if(el){
        el.addEventListener("wheel", (evt) => {    
            if (evt.deltaY < 0){
                if(el.scrollLeft !== 0){
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
  }

  updateScrollPosition = () => {
  /*
  Updates horizontal scroll position of the player to display the playing item in the center
  */
    let el1 = document.querySelector('.main-wrapper');
    let el2 = document.querySelector('#played_queue_card');
    let el3 = document.querySelector('#queue');
    if(el1 && el2){
        el1.scrollLeft = el2.offsetWidth - Math.min(window.innerWidth  * .1, el3.offsetWidth) ;
    }
  }

  refreshToken(x){
  /*
  Refresh spotify access token via api to allow player to stay active and avoid token timeout
  */
    $.ajax({
      url: `https://accounts.spotify.com/api/token`,
      type: "POST",
      data: {
          grant_type: "refresh_token",
          refresh_token: this.state.refresh_token,
          client_id: clientId,
          client_secret: clientSecret,
      },
      success: (data) => {
      console.log("successfully refreshed token");
      console.log(data);
        if(data){
              this.setState({
                    token: data.access_token
                  });
        }
      },
      error: () => {
            if(x < 10){
                console.log("failured to refresh token, trying again");
                console.log(x);
                this.refreshToken(x+1);
            }
      }
    });
  }

  async waitForSpotifyWebPlaybackSDKToLoad (data) {
        if (window.Spotify) {
          let access_token = data.access_token;
          let refresh_token = data.refresh_token;
                  
          let player = new window.Spotify.Player({
             name: 'Pickles Web Player',
            getOAuthToken: cb => cb(access_token)
          });

          // Error handling
          player.addListener('initialization_error', message => console.error(message));
          player.addListener('authentication_error', message => console.error(message));
          player.addListener('account_error', message => console.error(message));
          player.addListener('playback_error', message => console.error(message));

          // Playback status updates
          player.addListener('player_state_changed', state => this.updatePlaying(false, true));

          //On Autoplay failure
          player.addListener('autoplay_failed', () => console.log('Autoplay is not allowed by the browser'));

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

          //set up /me
          fetch(`https://api.spotify.com/v1/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
          })
          .then(response => response.json())
          .then(data => {
                console.log("successfully set up spotify player");
                this.setState({
                    userID: data.id,
                    player: player,
                    token: access_token,
                    refresh_token: refresh_token,
                    code: code.code,
                });
          })
          .catch((error) => {console.log(error); console.log("Failed to set up player")});
        } else {
          window.onSpotifyWebPlaybackSDKReady = () => {
            let access_token = data.access_token;
            let refresh_token = data.refresh_token;
                  
            let player = new window.Spotify.Player({
                name: 'Pickles Web Player',
                getOAuthToken: cb => cb(access_token)
            });

            // Error handling
            player.addListener('initialization_error', message => console.error(message));
            player.addListener('authentication_error', message => console.error(message));
            player.addListener('account_error', message => console.error(message));
            player.addListener('playback_error', message => console.error(message));

            // Playback status updates
            player.addListener('player_state_changed', state => this.updatePlaying(false, true));

            //On Autoplay failure
            player.addListener('autoplay_failed', () => console.log('Autoplay is not allowed by the browser'));

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

            //set up /me
            fetch(`https://api.spotify.com/v1/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("successfully set up spotify player");
                this.setState({
                    userID: data.id,
                    player: player,
                    token: access_token,
                    refresh_token: refresh_token,
                    code: code.code,
                });
            })
            .catch((error) => {console.log(error); console.log("Failed to set up player")});
          };
        }
  }

 componentDidMount() {
 /*
 Initial functions run once this component mounts (will only be called once after the first render)
 */
    //run particles
    particlesJS.load('particles-js', 'particles.json', function() {/*callback*/});
    //window.location.search = "";
    window.history.replaceState(this.state, "Pickles", "index.html");


    //use code from url
    console.log(code);
    if (code.code) {
        console.log("code exists");

        //set up token based on code
        $.ajax({
          url: `https://accounts.spotify.com/api/token`,
          type: "POST",
          data: {
              grant_type: "authorization_code",
              code: code.code,
              client_secret: clientSecret,
              client_id: clientId,
              redirect_uri: redirectUri,
              scope: scopes.join("%20")
          },
          success: (data) => {
              console.log("successfully logged in with code");
              console.log(data);
              if(data){
                  this.waitForSpotifyWebPlaybackSDKToLoad(data);
                  console.log("The Web Playback SDK has loaded.");
              };
              
              //start tick
              this.timerID = setInterval(() => this.tick(data.access_token), 1000);
          },
          error: () =>{
            console.log("failured to login with code");
          }
        });
    }
 }

 render() {
 /*
 Funtion which runs every time this component renders or rerenders due to a state change (called once before componentDidMount)
 */
    // Show search results
    let card;
    if(this.state.searchResults.length > 0){
        card = <Card>
                    <List itemLayout="horizontal">
                        {this.state.searchResults}
                    </List>
                </Card>;
    }
    else {
        card = <Card hidden={true}/>;
    }

    //return web page
    return ( 
      <div className="App">
        {/* preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet"/>
        <div id="particles-js"></div>
        
        {/* normal page loading */}
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          {/* token doesn't exist, then load login screen */}
          {!code.code && (
              <a  className="btn btn--loginApp-link"
                  href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&show_dialog=false`}
              >
                  Login to Spotify
              </a>
          )}
          {/* token does exist, then load player */}
          {/* TODO: confirm all these state properties are needed */}
          {code.code && (
              <div style={{zIndex: 10, width: "100%", height: "100%"}}>
                  
                  {/* Song Queue */}
                  <Player 
                      is_playing={this.state.is_playing}
                      progress_ms={this.state.progress_ms}
                      next={this.state.next}
                      the_token={this.state.token}
                      playFunc={this.play}
                      updateFunc={this.updatePlaying}
                      nextFunc={this.playNextSong}
                      prevFunc={this.playPreviousSong}
                      device={this.state.deviceID}
                      user={this.state.userID}
                      total_queue={this.state.total_queue}
                      queue_pos={this.state.queue_pos}
                      clearQueue={this.clearQueue}
                  />

                  {/* Song recomendations */}
                  <NextPlayer
                      is_playing={this.state.is_playing}
                      progress_ms={this.state.progress_ms}
                      playFunc={this.play}
                      queueFunc={this.queue}
                      device={this.state.deviceID}
                      user={this.state.userID}
                      next={this.state.next}
                      queue_pos={this.state.queue_pos}
                      total_queue={this.state.total_queue}
                      refreshFunc={this.updatePlaying}
                  />

                  {/* Refresh Recomendations Button */}
                  {/* TODO: move all styles to css */}


                  {/* Song Search Field & Results */}
                  <div className="Search">
                      <Input
                          id="searchInput" 
                          style={{fontFamily: "Roboto"}}
                          placeholder="Search for a song"
                          size="large"
                          onChange={value => {
                                this.setState({searchValue: value.target.value});
                                this.getSearchResults(value.target.value)
                          }}
                          allowClear={true}
                          value={this.state.searchValue}
                          prefix={<SearchOutlined className="search-form-icon" />}
                      />
                      {card}
                  </div>

                  {/* Clear Button */}
                   <div
                       style={{
                            margin: 'auto',
                            paddingBottom: '50px',
                            display: 'inline-block'
                       }}>
                    <Button 
                       style={{
                            display: (!this.state.total_queue[this.state.queue_pos]?.id ? 'none' :'block')
                       }} 
                       onClick={() => {this.clearQueue();}} danger>
                       Clear Queue
                    </Button>
                   </div>
                   <script src="https://sdk.scdn.co/spotify-player.js"></script>
              </div>

          )}
        </div>
      </div>
    );
  }
}

export default App;
