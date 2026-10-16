import React from "react";
import "./App.css";
import refresh_btn from "./images/refresh.png";
import refresh_btn_dark from "./images/refresh(copy).png";
import "antd/dist/antd.css";

const NextPlayer = (props) => {
  const recommendations = props.next ? props.next.slice(0, 3) : [];
  return (
    <div id="nextPlayer">
      {!props.next && (
        <React.Fragment>
          <p>loading recommendations...</p>
        </React.Fragment>
      )}
      {props.next && (
        <React.Fragment>
          {recommendations.length > 0 && (
            <div
              style={{
                display: "block",
                width: "84%",
                height: "100%",
              }}
            >
              {recommendations.map((track, index) => (
                <div
                  className="next-wrapper"
                  key={track.id || index}
                  onClick={function () {
                    props.queueFunc(
                      track,
                      props.total_queue.length,
                      props.isFirst
                    );
                  }}
                >
                  <div className="next-playing__img">
                    <img src={track.album.images[0].url} alt="player" />
                  </div>
                  <div className="next-playing__side">
                    <div className="next-playing__name">{track.name}</div>
                    <div className="next-playing__artist">
                      {track.artists[0].name}
                    </div>
                    <div
                      className="next-playing_attributes"
                      style={{
                        fontSize: "calc(10px + 1vmin)",
                        overflowX: "scroll",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {props.next_features ? props.next_features[index] : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            id="refresh-div"
            onClick={() => {
              props.refreshFunc(true);
            }}
          >
            <div
              id="refresh_btn_div"
              style={{
                display: "block",
                maxWidth: "60%",
              }}
            >
              <img
                id="refresh_btn"
                alt="refresh recommendations"
                src={props.isDark ? refresh_btn_dark : refresh_btn}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default NextPlayer;
