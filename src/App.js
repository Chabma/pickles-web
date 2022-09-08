import React, { Component } from "react";
import { Input, List, Avatar, Card, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./App.css";
import * as $ from "jquery";
import Player from "./Player";
import NextPlayer from "./NextPlayer";
import SearchItem from "./SearchItem";
import logo from ".list_play_btn/images/logo.png";
//import 'particles.js/particles';
import { tsParticles } from "tsparticles";
const { Search } = Input;

// Spotify info
export const authEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";
const clientId = "fadd120c4e7a4a1a954bf081a4fd6e59";
const clientSecret = "97c1d3b88b9e4a89898482bb4141b2df";
//TODO: change uses of client Secret to Base 64 encoded uses
const redirectUri = "https://chabma.github.io/pickles-web/";
//var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
  "user-top-read",
  "user-read-recently-played",
];

// set up particlesJS
const particlesJS = window.particlesJS;
console.log(window.location);

// get the code from the url;
const code = window.location.search.split("?").reduce(function (initial, item) {
  if (item) {
    var parts = item.split("=");
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});

// ======= Debounce =======
const debounce = (context, func, delay) => {
  let timeout;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

const click_delay = 600;
let last_click = 0;
let current_click = new Date();
let pause_switch = false;

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      code: null,
      refresh_token: null,
      player: null,
      deviceID: null,
      devices: [],
      searchValue: "",
      searchResults: [],
      is_playing: false,
      progress_ms: 0,
      total_queue: [],
      queue_pos: 0,
      userID: "",
      next: null,
      current: false,
      next_features: [],
      additionalFeatures: [],
      current_time: Date.now(),
      additionalFeatureString: "",
      playlock: false,
      playbackSession: null,
      isPicklesPlayer: true,
      userImage: "assets/user-avatar.png",
    };
  }

  getSearchResults(query) {
    /*
  Create search items and then add to state total queue
  */
    const searchQuery = query;
    const fetchURL = encodeURI(`q=${searchQuery}`);

    //search with spotify api
    fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.state.token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Response Not Ok");
        }
        return response;
      })
      .then((response) => response.json())
      .then(({ tracks }) => {
        //create an item for each search result
        const results = [];
        tracks.items.forEach((element) => {
          let artists = [];
          element.artists.forEach((artist) => artists.push(artist.name));

          results.push(
            <SearchItem
              element={element}
              artists={artists}
              queue_pos={this.state.queue_pos}
              total_queue={this.state.total_queue}
              setFunc={(value, results) => {
                this.setState({
                  searchValue: value,
                  searchResults: results,
                });
              }}
              playFunc={this.play}
              queueFunc={this.queue}
              player={this.state.player}
            />
          );
        });

        //update search results
        this.setState({
          searchResults: results,
        });
      })
      .catch((error) =>
        this.setState({
          searchResults: [],
        })
      );
  }

  getDevices() {
    /*
  Create device items for device chooser
  */
    fetch(`https://api.spotify.com/v1/me/player/devices`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.state.token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Response Not Ok");
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        //update search results
        this.setState({
          devices: data.devices,
        });
      })
      .catch((error) =>
        this.setState({
          devices: [],
        })
      );
  }

  getUserImage() {
        /*
      Create user image from spotify
      */
      fetch(`https://api.spotify.com/v1/users/${this.state.userID}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${this.state.token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error("Response Not Ok");
                }
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                //update search results
                if (data.images.length > 0) {
                    this.setState({
                        userImage: data.images[0].url,
                    });
                }
            })
            .catch((error) =>
                this.setState({
                    userImage: "assets/user-avatar.png",
                })
            );
  }

  queue = (track, position, playBoolean = false) => {
    /*
  Create new item and add item to state's total queue 
  (updates via a call to getRecs?)
  */
    //enable Horizontal Scroll
    this.enableHorizontalScroll();

    //create new item
    let artists = track.artists.map((item) => item.name);
    let item = {
      uri: track.uri,
      id: track.id,
      songDuration: track.duration_ms,
      name: track.name,
      artists: track.artists,
      image: track.album.images[0],
      item: (
        <List.Item
          key={track.uri.concat("-", Date.now.toString())}
          style={{ height: "100%", border: "4px solid #0000" }}
        >
          <List.Item.Meta
            style={{ display: "block" }}
            avatar={
              <Avatar
                shape="square"
                size="large"
                src={track.album.images[0].url}
                style={{ height: "50%", width: "150px" }}
              />
            }
            title={<p href="https://ant.design">{track.name}</p>}
            description={artists.join(", ")}
          />
        </List.Item>
      ),
    };

    //add item to total_queue
    let tempQueue = [...this.state.total_queue.slice(0, position)];
    tempQueue.push(item);
    tempQueue = [...tempQueue, ...this.state.total_queue.slice(position)];

    this.setState({ total_queue: tempQueue }, () => {
      if (playBoolean) {
        this.play(position);
      }
      this.getRecs();
    });

    //update queue scroll to keep now playing in the middle
    //TODO: determine if this is needed
  };

  play = (queuePosition = this.state.queue_pos) => {
    /*
  Call spotify api to play the song at `queuePosition` via current web player (calls update playing function)
  */
    if (queuePosition >= 0) {
      if (queuePosition >= this.state.total_queue.length) {
        this.queue(this.state.next[0], this.state.total_queue.length, true);
      } else {
        if (!this.playLock) {
          this.setState({
            //deviceID: data?.device.id ?? this.state.deviceID,
            playLock: true,
          });
          this.state.player._options.getOAuthToken((access_token) => {
            fetch(
              `https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceID}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  uris: [this.state.total_queue[queuePosition]?.uri],
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
              .then((response) => response.text())
              .then((data) => {
                this.setState(
                  {
                    queue_pos: queuePosition,
                    playLock: false,
                  },
                  () => {
                    //console.log("updating based on play function")
                    if (!this.state.isPicklesPlayer) {
                      this.updatePlaying(false);
                    }
                  }
                );
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      }
    }
  };

  updatePlaying = (refreshSelections, setItemBoolean = true) => {
    /*
  Update's current state based on spotify api 
  (updates via a call to get Recs?)
  */

    //can this line be moved to init?
    this.enableHorizontalScroll();

    fetch(`https://api.spotify.com/v1/me/player/devices`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.state.token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("DEVICE Response Not Ok");
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        //update search results
        console.log(data);
        this.setState({
          devices: data.devices,
        });
        let deviceIDs = data.devices.map((x) => x.id);
        console.log(deviceIDs);
        console.log(deviceIDs.includes(this.state.deviceID));
        if (deviceIDs.includes(this.state.deviceID)) {
          //update player info based on spotify's latest info
          $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + this.state.token
              );
            },
            success: (data) => {
              if (setItemBoolean) {
                console.log("here in setItemBoolean for update");
                console.log(data);
                this.setState({
                  //deviceID: data?.device.id ?? this.state.deviceID,
                  is_playing: data?.is_playing ?? this.state.is_playing,
                  progress_ms: data?.progress_ms ?? this.state.progress_ms,
                });

                console.log(data?.is_playing);
                console.log(this.state.is_playing);
              }
              if (refreshSelections) {
                this.getRecs();
              }

              // set up android player

              if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                  title: data?.item.name ?? "Pickles",
                  artist: data?.item.artists[0].name ?? "Pickles",
                  album: data?.item.album.name ?? "Pickles",
                  artwork: [{src: data?.item.album.images[0].url ?? "./images/logo.png"}],
                });
                  console.log(navigator)

                  navigator.mediaSession.setActionHandler("previoustrack", () => this.play(this.state.queue_pos - 1));
                  navigator.mediaSession.setActionHandler("nexttrack", () => this.play(this.state.queue_pos + 1));
                // TODO: Update playback state.
              }

              this.updateScrollPosition();
            },
            error: (e) => {
              console.log("Failure getting player info");
              console.log(e.responseText);
            },
          });
        } else {
          console.log("another player created");
          console.log(data);
          this.setUpPlayer(
            {
              access_token: this.state.token,
              refresh_token: this.state.refresh_token,
            },
            true
          );
        }
      })
      .catch((error) =>
        this.setState({
          devices: [],
        })
      );
  };

  getRecs = (firstSongs = null) => {
    /*
  Calls recomendation api with last 5 songs and updates the three recommendations
  */
    //TODO: change so that this calls the global queue instead of inputs
    //TODO: replace first call with a global variable that keeps track of target features
    let additionalFeatures = this.state.additionalFeatures;
    let primaryFeature = $("#primary_features").val();
    let additionalFeatureValues = {};
    let all_tracks = this.state.total_queue.map((x) => x.id);
    let all_artists = this.state.total_queue.map((x) => x.artists[0].id);
    if (firstSongs != null) {
      all_tracks = firstSongs.map((x) => x.id);
      all_artists = firstSongs.map((x) => x.artists[0].id);
    }
    let tracks_string = "seed_tracks=" + all_tracks.slice(-3).join("%2C");
    let feature_tracks_string = "ids=" + all_tracks.slice(-25).join("%2C");
    let artists_string = "seed_artists=" + all_artists.slice(-3).join("%2C");
    //tracks_string = `${track},${tracks_string}`;

    $.ajax({
      url: `https://api.spotify.com/v1/audio-features?${feature_tracks_string}`,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      success: (data) => {
        if (data) {
          for (var i = 0; i < data.audio_features.length; i++) {
            for (var j = 0; j < additionalFeatures.length; j++) {
              additionalFeatureValues[additionalFeatures[j]] =
                additionalFeatureValues[additionalFeatures[j]] ?? 0;
              additionalFeatureValues[additionalFeatures[j]] +=
                data.audio_features[i][additionalFeatures[j]];
            }
          }
          for (j = 0; j < additionalFeatures.length; j++) {
            let divisor = Math.min(data.audio_features.length, 25);
            additionalFeatureValues[additionalFeatures[j]] =
              additionalFeatureValues[additionalFeatures[j]] / divisor;
          }
        }

        let stateAdditionalFeatureString = "";

        // construct string from features for each additional feature.
        let additionalFeatureString = "";
        for (j = 0; j < additionalFeatures.length; j++) {
          additionalFeatureString +=
            "&target_" +
            additionalFeatures[j] +
            "=" +
            additionalFeatureValues[additionalFeatures[j]];
          stateAdditionalFeatureString +=
            " || " +
            additionalFeatures[j] +
            " : " +
            additionalFeatureValues[additionalFeatures[j]];
        }

        if (primaryFeature === "song") {
          artists_string =
            "seed_artists=" + all_artists[all_artists.length - 1];
        } else {
          tracks_string = "seed_tracks=" + all_tracks[all_tracks.length - 1];
        }

        let limit_num = 10 + this.state.total_queue.length;
        //add additional features string to recs request string:
        let recRequestString = `https://api.spotify.com/v1/recommendations?limit=${limit_num}&${artists_string}&seed_genres=%20&${tracks_string}${additionalFeatureString}`;
        $.ajax({
          url: recRequestString,
          type: "GET",
          beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
          },
          success: (data) => {
            if (data) {
              let recSongs = [];
              let h = 0;
              let shuffled = data.tracks
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
              for (var i = 0; i < shuffled.length && h < 3; i++) {
                let seen_bool = false;
                for (var j = 0; j < this.state.total_queue.length; j++) {
                  if (shuffled[i].id === this.state.total_queue[j].id) {
                    seen_bool = true;
                  }
                }
                if (!seen_bool) {
                  recSongs.push(shuffled[i]);
                  h++;
                }
              }

              tracks_string = "ids=";
              for (i = 0; i < recSongs.length; i++) {
                tracks_string += recSongs[i].id + "%2C";
              }

              let featureRequestString = `https://api.spotify.com/v1/audio-features?${tracks_string}`;

              this.setState({
                next: recSongs,
              });
              if (!firstSongs) {
                this.setState({
                  current: true,
                });
              }

              $.ajax({
                url: featureRequestString,
                type: "GET",
                beforeSend: (xhr) => {
                  xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + this.state.token
                  );
                },
                success: (data) => {
                  if (data) {
                    //construct string for each song with the additional feature scores
                    //TODO
                    let next_features = [];
                    for (var i = 0; i < data.audio_features.length; i++) {
                      next_features[i] = "";
                      for (var j = 0; j < additionalFeatures.length; j++) {
                        next_features[i] +=
                          " || " +
                          additionalFeatures[j] +
                          " : " +
                          data.audio_features[i][additionalFeatures[j]];
                      }
                    }

                    //update recommendations
                    this.setState({
                      next_features: next_features,
                      additionalFeatureString: stateAdditionalFeatureString,
                    });
                  }
                },
                error: () => {
                  console.log("Failure loading features for recommendations");
                },
              });
            }
          },
          error: () => {
            console.log("Failure loading recommendations");
          },
        });
      },
      error: () => {
        console.log("Failure loading audio features");
      },
    });
  };

  tick() {
    /*
  Called every second to inch forward progress bar and check if the spotify token should be refreshed
  */
    // check if next song should play
    if (this.state.is_playing) {
      let nextSecond = this.state.progress_ms + 1000;
      let currentSongDuration = this.state.total_queue[this.state.queue_pos]?.songDuration;
        if (nextSecond + 1000 >= currentSongDuration) {
            console.log("updating for tick")
           //let currentSong = this.state.total_queue[this.state.queue_pos]?.id
            //let lastPlayedSong = this.get_last_played_song()
            //if (currentSong == lastPlayedSong) {
                //console.log(currentSong)
                //console.log(" -> current . lastSong -> "+lastPlayedSong)
                this.play(this.state.queue_pos + 1);
           // }
        } else {
            this.setState({
                progress_ms: nextSecond,
            });
        }
    }

    // check for token refresh
    if (Date.now() - this.state.current_time > 1800000) {
      this.setState({
        current_time: Date.now(),
      });
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
      current: false,
    });
    this.getFirstRecs();
  };

  enableHorizontalScroll = () => {
    /*
  Adds horizontal Scroll to player window
  TODO: call once / why can't I set this in html even?
  */
    let el = document.querySelector(".main-wrapper");
    if (el) {
      el.addEventListener("wheel", (evt) => {
        if (evt.deltaY < 0) {
          if (el.scrollLeft !== 0) {
            evt.preventDefault();
            el.scrollLeft += evt.deltaY * 0.03;
          }
        } else {
          if (el.scrollLeft < el.scrollWidth - el.clientWidth) {
            evt.preventDefault();
            el.scrollLeft += evt.deltaY * 0.03;
          }
        }
      });
    }
  };

  updateScrollPosition = () => {
    /*
  Updates horizontal scroll position of the player to display the playing item in the center
  */
    let el1 = document.querySelector(".main-wrapper");
    let el2 = document.querySelector("#played_queue_card");
    let el3 = document.querySelector("#queue");
    if (el1 && el2) {
      el1.scrollLeft =
        el2.offsetWidth - Math.min(window.innerWidth * 0.1, el3.offsetWidth);
    }
  };

  refreshToken(x) {
    /*
  Refresh spotify access token via api to allow player to stay active and avoid token timeout
  */
    //TODO: add device refresh here
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
        if (data) {
          this.setState({
            token: data.access_token,
          });
        }
      },
      error: () => {
        if (x < 10) {
          console.log("failured to refresh token, trying again");
          console.log(x);
          this.refreshToken(x + 1);
        }
      },
    });
  }

  setUpPlayer(data, playAfter = false) {
    let access_token = data.access_token;
    let refresh_token = data.refresh_token;

    let player = new window.Spotify.Player({
      name: "Pickles Web Player",
      getOAuthToken: (cb) => cb(access_token),
    });

    // Error handling
    player.addListener("initialization_error", (message) =>
      alert(message.message)
    );
    player.addListener("authentication_error", (message) =>
      alert(message.message)
    );
    player.addListener("account_error", (message) => alert(message.message));
    player.addListener("playback_error", (message) => alert(message.message));

    // Playback status updates based on headphone buttons
    player.addListener("player_state_changed", (state) => {
      console.log("updating based on player state changed listener");
      console.log(state);
      this.updatePlaying(false, false);
      this.setState({
        //deviceID: data?.device.id ?? this.state.deviceID,
        is_playing: !state?.paused ?? this.state.is_playing,
        progress_ms: state?.position ?? this.state.progress_ms,
      });
        /*
      if (
        state.position >=
        this.state.total_queue[this.state.queue_pos]?.songDuration - 2000
      ) {

        this.play(this.state.queue_pos + 1);
      }
      */
      if (pause_switch != state.paused) {
        pause_switch = state.paused;

        /*
                    // add double press detection
                      last_click = current_click;
                      current_click = new Date();
                      if (current_click - last_click < click_delay) {
                        this.play(this.state.queue_pos + 1);
                    }
                    */
      } else {
        pause_switch = state.paused;
      }
    });

    //On Autoplay failure
    player.addListener("autoplay_failed", () =>
      console.log("Autoplay is not allowed by the browser")
    );

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      this.setState({
        deviceID: device_id,
      });
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();

    //set up /me
    fetch(`https://api.spotify.com/v1/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("successfully set up spotify player");
        this.setState(
          {
            userID: data.id,
            player: player,
            token: access_token,
            refresh_token: refresh_token,
            code: code.code,
          },
          this.getFirstRecs
        );

          this.getUserImage();
        this.getDevices();

        if (playAfter) {
          this.play();
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to set up player");
      });
  }

  getFirstRecs() {
    fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.getRecs(data.items);
      });
  }

  waitForSpotifyWebPlaybackSDKToLoad(data) {
    /*
  Wait for Spotify to load and update parameters once loaded 
  */
    if (window.Spotify) {
      console.log("window.Spotify exists");
      this.setUpPlayer(data);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("entering spotify webplayback sdk ready");
        this.setUpPlayer(data);
      };
    }
  }

  componentDidMount() {
    /*
 Initial built in function run once this component mounts (will only be called once after the first render)
 */
    //run particles
    tsParticles.loadJSON("particles-js", "particles.json");
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
          scope: scopes.join("%20"),
        },
        success: (data) => {
          console.log("successfully logged in with code");
          console.log(data);
          if (data) {
            this.waitForSpotifyWebPlaybackSDKToLoad(data);
            console.log("The Web Playback SDK has loaded.");
          }

          //start tick
          this.timerID = setInterval(() => this.tick(data.access_token), 1000);
          this.timerID = setInterval(() => this.updatePlaying(false), 15000);
        },
        error: () => {
          console.log("failured to login with code");
        },
      });
    }
  }

  collapseSection() {
    var content = document.getElementById("advanced_setting");
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  }

  add_playlist_btn_func(playlist_name, user_id) {
    /*
  Button function for adding the current playlist to a user's spotify account
  */
    console.log(playlist_name);
    let playlist_id = "";
    let data = {
      name: playlist_name,
      description: "Made by Pickles, d'illest playlist creator web app",
      public: false,
    };
    fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        playlist_id = data.id;
        this.add_songs_to_playlist(playlist_id);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Creating Playlist");
      });
  }

  add_songs_to_playlist(playlist_id) {
    /*
  Function to add a single song to a playlist (called for every song when creating a new playlist)
  */
    fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${this.state.total_queue.map(
        (x) => "spotify%3Atrack%3A" + x.id
      )}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token}`,
        },
      }
    ).then((response) => {
      if (!response.ok) {
        this.add_songs_to_playlist(playlist_id);
      } else {
        alert("Playlist Uploaded Succesfully");
      }
    });
  }

    get_last_played_song() {
        /*
      Function to add a single song to a playlist (called for every song when creating a new playlist)
      */
        fetch(
            `https://api.spotify.com/v1/me/player/recently-played?limit=1`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.state.token}`,
                },
            }
        ).then((response) => {
            return response?.items[0].track.id
        });
    }

    expand_settings = () => {
      /*
    let el = document.getElementsByClassName("settings_header")[0];
    el.classList.toggle("active");
    var content = el.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
        content.style.display = "block";
        window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
        })
    }
    */
    };
    expand_logout_settings = () => {
      let el = document.getElementsByClassName("user_logout_div")[0];
        if (el.style.display === "block") {
            el.style.display = "none";
      } else {
         el.style.display = "block";
      }
    };

  render() {
    /*
 Built in Funtion which runs every time this component renders or rerenders due to a state change (called once before componentDidMount)
 */

    //if(isSafari){
    //     alert("Pickles does not work on IOS devices. Sorry!")
    //}
    // Show search results
    let card;
    if (this.state.searchResults.length > 0) {
      card = (
        <Card>
          <List itemLayout="horizontal">{this.state.searchResults}</List>
        </Card>
      );
    } else {
      card = <Card hidden={true} />;
    }

    //return web page
    return (
      <div className="App">
        {/* preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div id="particles-js"></div>

        {/* normal page loading */}
            <div className="App-header" >
          <img id="logo" src="assets/logo.png"></img>
          <h1 id="logo_text"> PICKLES</h1>
                <img id="account_image" src={this.state.userImage} onClick={() => {
                    this.expand_logout_settings();
                }}></img>
                <div className="user_logout_div" style={{ display: "none"}}>
                    <a href="https://accounts.spotify.com/logout" style={{ color: "red" }}> Logout? </a>
                </div>
        </div>
        <div className="App-main">
          {/*<img src={logo} className="App-logo" alt="logo" /> */}

          {/* token doesn't exist, then load login screen */}
          {!code.code && (
            <>
              <meta
                http-equiv="Refresh"
                content={`0; url='${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=code&show_dialog=false'`}
              />
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=code&show_dialog=false`}
              >
                Login to Spotify
              </a>
            </>
          )}
          {/* token does exist, then load player */}
          {/* TODO: confirm all these state properties are needed */}
          {code.code && (
            <div style={{ zIndex: 10, width: "100%", height: "100%" }}>
              {/* Song Queue */}
              <Player
                is_playing={this.state.is_playing}
                progress_ms={this.state.progress_ms}
                next={this.state.next}
                current={this.state.current}
                the_token={this.state.token}
                playFunc={this.play}
                updateFunc={(bool) => {
                  console.log("updating because of player js");
                  this.updatePlaying(bool);
                }}
                player={this.state.player}
                device={this.state.deviceID}
                user={this.state.userID}
                total_queue={this.state.total_queue}
                queue_pos={this.state.queue_pos}
                clearQueue={this.clearQueue}
                additionalFeatureString={this.state.additionalFeatureString}
                isPicklesPlayer={this.state.isPicklesPlayer}
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
                next_features={this.state.next_features}
                queue_pos={this.state.queue_pos}
                total_queue={this.state.total_queue}
                isFirst={!this.state.current}
                refreshFunc={(bool) => {
                  if (this.state.current) {
                    console.log("updating based on next player js");
                    this.updatePlaying(bool);
                  } else {
                    this.getFirstRecs();
                  }
                }}
              />

              {/* Refresh Recomendations Button */}
              {/* TODO: move all styles to css */}

              {/* Song Search Field & Results */}
              <div className="Search">
                <input
                  id="searchInput"
                  style={{
                    color: "black",
                    fontFamily: "Roboto",
                    width: "100%",
                  }}
                  placeholder="Song Search..."
                  size="large"
                  onChange={(value) => {
                    this.setState({ searchValue: value.target.value });
                    debounce(
                      this,
                      this.getSearchResults(value.target.value),
                      10000
                    );
                  }}
                  allowClear={true}
                  value={this.state.searchValue}
                  prefix={<SearchOutlined className="search-form-icon" />}
                />
                {card}
              </div>
              <button
                type="button"
                class="settings_header"
                onClick={() => {
                  this.expand_settings();
                }}
              >
                SETTINGS
              </button>

              <div class="settings">
                <h4> Recommendation Logic: </h4>
                <label for="primary_features">Match Target: </label>
                <select name="primary_features" id="primary_features">
                  <option value="song">Songs</option>
                  <option value="artist">Artists</option>
                </select>
                <Select
                  name="additional_features"
                  id="additional_features"
                  mode="multiple"
                  allowClear
                  showSearch={false}
                  placeholder="Audio features to match (choose Multiple)"
                  style={{ width: "80%" }}
                  onChange={(value) => {
                    this.setState({ additionalFeatures: value });
                  }}
                >
                  <option value="acousticness">Acousticness</option>
                  <option value="danceability">Danceability</option>
                  <option value="energy">Energy</option>
                  <option value="instrumentalness">Instrumentalness</option>
                  <option value="key">Key</option>
                  <option value="liveness">Liveness</option>
                  <option value="loudness">Loudness</option>
                  <option value="speechiness">Speechiness</option>
                  <option value="tempo">Tempo</option>
                  <option value="valence">Valence</option>
                </Select>
                <div id="slider" class="push-bottom">
                  <div id="slider-target"></div>
                </div>

                <div>
                  <br />
                  <h4
                    style={{
                      display: !this.state.total_queue[this.state.queue_pos]?.id
                        ? "none"
                        : "block",
                    }}
                  >
                    {" "}
                    Save to Spotify:
                  </h4>
                  <Search
                    className="Search"
                    style={{
                      margin: "auto",
                      padding: "0",
                      height: "10%",
                      fontFamily: "Roboto",
                      maxWidth: "85%",
                      width: "700px",
                      display: !this.state.total_queue[this.state.queue_pos]?.id
                        ? "none"
                        : "block",
                    }}
                    type="text"
                    id="playlist_name"
                    placeholder="Playlist Name"
                    enterButton="Save Session as Playlist"
                    onSearch={() => {
                      this.add_playlist_btn_func(
                        document.getElementById("playlist_name").value,
                        this.state.userID
                      );
                    }}
                  />
                </div>
                <br />
                {/* Device Chooser */}
                <Button
                  type="dashed"
                  class="collapsible"
                  onClick={() => {
                    this.collapseSection();
                  }}
                  style={{ display: "none" }}
                >
                  Advanced Settings
                </Button>
                {this.state.deviceID && (
                  <div id="advanced_setting">
                    <h4> Device Chooser:</h4>
                    <Select
                      labelInValue
                      name="available_devices"
                      id="available_devices"
                      defaultValue={{
                        value: this.state.deviceID,
                        label:
                          "Pickles Web Player - " +
                          this.state.deviceID.slice(0, 3),
                      }}
                      style={{
                        margin: "auto",
                        padding: "0",
                        height: "10%",
                        fontFamily: "Roboto",
                        maxWidth: "85%",
                        width: "50%",
                      }}
                      onChange={(value) => {
                        this.setState({
                          deviceID: value.value[0],
                        });
                        if (value.value[1] != "Pickles Web Player") {
                          this.setState({
                            isPicklesPlayer: false,
                          });
                        }
                        console.log(value.value);
                      }}
                    >
                      {this.state.devices.map((option) => (
                        <option
                          value={[option.id, option.name]}
                          label={option.name + " - " + option.id.slice(0, 3)}
                        >
                          {option.name + " - " + option.id.slice(0, 3)}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                <br />
                {/* Clear Button */}
                <div
                  style={{
                    margin: "auto",
                    paddingBottom: "50px",
                    display: "inline-block",
                  }}
                >
                  <Button
                    style={{
                      display: !this.state.total_queue[this.state.queue_pos]?.id
                        ? "none"
                        : "block",
                    }}
                    onClick={() => {
                      this.clearQueue();
                    }}
                    danger
                  >
                    Clear Session
                  </Button>
                </div>
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
