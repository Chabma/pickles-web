import React from "react";
import "./App.css";
import { Card } from "antd";
import "antd/dist/antd.css";
import play_btn from "./images/play.png";
import pause_btn from "./images/pause.png";
import next_btn from "./images/next.png";
import previous_btn from "./images/previous.png";
import add_to_library from "./images/addToLibrary.png";
import checked_library from "./images/checkToLibrary.png";
import play_btn_dark from "./images/play(copy).png";
import pause_btn_dark from "./images/pause(copy).png";
import next_btn_dark from "./images/next(copy).png";
import previous_btn_dark from "./images/previous(copy).png";
import add_to_library_dark from "./images/addToLibrary(copy).png";
import checked_library_dark from "./images/checkToLibrary(copy).png";

const Player = (props) => {
  const play_btn_func = (device) => {
    document.getElementById("play_btn_div").style.display = "none";
    document.getElementById("pause_btn_div").style.display = "block";
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.the_token}`,
      },
    }).then((data) => {
      props.updateLastSecond();
      if (!props.isPicklesPlayer) {
        props.updateFunc(false);
      }
    });
  };

  const seek_func = (device, event_offset) => {
    let box = document.querySelector(".now-playing__side");
    let width = box.offsetWidth;

    let duration = props.total_queue[props.queue_pos]?.songDuration;

    let pos = Math.round((event_offset / width) * duration);

    fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${pos}&device_id=${device}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.the_token}`,
        },
      }
    ).then((data) => {
      if (!props.isPicklesPlayer) {
        props.updateFunc(false);
      }
    });
  };

  const pause_btn_func = (device, updateBoolean) => {
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.the_token}`,
      },
    }).then((data) => {
      if (updateBoolean) {
        if (!props.isPicklesPlayer) {
          props.updateFunc(false);
        }
      } else {
        props.clearQueue();
      }
    });
  };

  const next_btn_func = (device) => {
    if (props.isDark){
      document.getElementById("library_btn_div").src = add_to_library_dark;
    }
    else{
      document.getElementById("library_btn_div").src = add_to_library;
    }
    props.playFunc(props.queue_pos + 1);
  };

  const previous_btn_func = (device) => {
    if (props.isDark){
      document.getElementById("library_btn_div").src = add_to_library_dark;
    }
    else{
      document.getElementById("library_btn_div").src = add_to_library;
    }
    props.playFunc(props.queue_pos - 1);
  };

  const add_to_library_btn_func = (track) => {
    if (props.isDark){
      document.getElementById("library_btn_div").src = checked_library_dark;
    }
    else{
    document.getElementById("library_btn_div").src = checked_library;
    }
    fetch(`https://api.spotify.com/v1/me/tracks?ids=${track}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.the_token}`,
      },
    });
  };

  const add_song_to_playlist = (playlist_id, i) => {
    fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=spotify%3Atrack%3A${props.total_queue[i].id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.the_token}`,
        },
      }
    ).then((response) => {
      if (!response.ok) {
        add_song_to_playlist(playlist_id, i);
      }
    });
  };

  const add_playlist_btn_func = (playlist_name, user_id) => {
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
        Authorization: `Bearer ${props.the_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        playlist_id = data.id;
        for (var i = 0; i < props.total_queue.length; i++) {
          add_song_to_playlist(playlist_id, i);
        }
        alert("Playlist Uploaded Succesfully");
      })
      .catch((error) => {
        console.log(error);
        alert("Error Creating Playlist");
      });
  };

  const progressBarStyles = {
    width:
      (props.progress_ms * 100) /
        props.total_queue[props.queue_pos]?.songDuration +
      "%",
  };

  let queue_card;
  if (props.queue_pos < props.total_queue.length) {
    queue_card = (
      <Card
        style={{
          overflowY: "hidden",
          overflow: "visible",
          width: "100%",
          float: "left",
          backgroundColor: "#0000",
          height: "100%",
          border: "0",
          padding: "0",
          boxSizing: "border-box",
        }}
      >
        <ul
          grid="{gutter: 16, column: 10}"
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            padding: "0",
          }}
        >
          {props.total_queue
            .slice(props.queue_pos + 1)
            .map((track) => track.item)}
        </ul>
      </Card>
    );
  } else {
    queue_card = <Card hidden={true} />;
  }

  let played_queue_card;
  if (props.queue_pos > 0) {
    played_queue_card = (
      <Card
        id="played_queue_card"
        style={{
          overflowY: "hidden",
          overflow: "visible",
          float: "right",
          backgroundColor: "#0000",
          height: "100%",
          border: "0",
          padding: "0",
          boxSizing: "border-box",
        }}
      >
        <ul
          grid="{gutter: 16, column: 10}"
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            padding: "0",
          }}
        >
          {props.total_queue
            .slice(0, props.queue_pos)
            .map((track) => track.item)}
        </ul>
      </Card>
    );
  } else {
    played_queue_card = <Card hidden={true} />;
  }
  
  let featureSummary;
  for (let i = 0; i < props.additionalFeatures.length; i++){
    if (props.additionalFeatures[i] == "acousticness"){
      featureSummary = props.additionalFeaturesString;
    }
  }

  return (
    <>
      {props.current ? (
              <div id="currentPlayer">
                  <div style={{ overflowX: "scroll",  whiteSpace: "nowrap", height: "10%" }}>{
                  //TODO: add here the function which translates additional features to colored divs 
                  props.additionalFeatureString}</div>
          <div style={{ height: "90%" }}>
            <div className="main-wrapper">
              <div id="played_queue">{played_queue_card}</div>
              <div className="now-playing__side">
                <div
                  style={{
                    maxWidth: "100%",
                    display: "flex",
                    height: "70%",
                    margin: "auto",
                  }}
                >
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      margin: "auto",
                    }}
                    src={props.total_queue[props.queue_pos]?.image.url}
                    alt="player"
                  />
                </div>
                <svg
                  viewBox="0 0 75 5"
                  style={{
                    overflow: "visible",
                    float: "left",
                    height: "10%",
                    fontWeight: "bold",
                  }}
                >
                  <text x="0" y="100%" textLength="100%" fontSize=".25em">
                    {props.total_queue[props.queue_pos]?.name}
                  </text>
                </svg>
                <svg
                  viewBox="0 0 50 5"
                  style={{
                    overflow: "visible",
                    float: "left",
                    height: "5%",
                  }}
                >
                  <text x="0" y="100%" textLength="100%" fontSize=".3em">
                    {props.total_queue[props.queue_pos]?.artists[0]?.name}
                  </text>
                </svg>
                <div id="buttons">
                  <img
                    id="previous_btn_div"
                    alt="previous song"
                    className="button_img"
                    src={
                      props.isDark
      ? previous_btn_dark
      : previous_btn}
                    onClick={function () {
                      previous_btn_func(props.device);
                    }}
                  />
                  <img
                    id="pause_btn_div"
                    alt="pause song"
                    className="button_img"
                    src={   props.isDark
                      ? pause_btn_dark
                      : pause_btn}
                    style={{ display: !props.is_playing ? "none" : "block" }}
                    onClick={function () {
                      pause_btn_func(props.device, true);
                    }}
                  />
                  <img
                    id="play_btn_div"
                    alt="play song"
                    className="button_img"
                    src={   props.isDark
                      ? play_btn_dark
                      : play_btn}
                    style={{ display: props.is_playing ? "none" : "block" }}
                    onClick={function () {
                      props.player.activateElement().then(() => {
                        play_btn_func(props.device);
                      });
                    }}
                  />
                  <img
                    id="forward_btn_div"
                    alt="next song"
                    className="button_img"
                    src={props.isDark
                      ? next_btn_dark
                      : next_btn}
                    onClick={function () {
                      next_btn_func(props.device);
                    }}
                  />
                  <img
                    id="library_btn_div"
                    alt="add song to library"
                    className="button_img"
                    src={props.isDark
                      ? add_to_library_dark
                      : add_to_library}
                    onClick={function () {
                      add_to_library_btn_func(
                        props.total_queue[props.queue_pos]?.id
                      );
                    }}
                  />
                </div>
                <div
                  className="progress"
                  onClick={function (event) {
                    seek_func(props.device, event.nativeEvent.offsetX);
                  }}
                >
                  <div className="progress__bar" style={progressBarStyles} />
                </div>
              </div>
              <div id="queue">{queue_card}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{ display: "block", height: "40%", marginBottom: "0" }}>
            START YOUR PLAYLIST WITH A SONG
          </h3>
        </>
      )}
    </>
  );
};
export default Player;
