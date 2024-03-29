import React from "react";
import "./App.css";
import refresh_btn from "./images/refresh.png";
import refresh_btn_dark from "./images/refresh(copy).png";
import "antd/dist/antd.css";

const NextPlayer = (props) => {
  return (
    <div id="nextPlayer">
      {!props.next && (
        <React.Fragment>
          <p>loading recommendations...</p>
        </React.Fragment>
      )}
      {props.next && (
        <React.Fragment>
            <div
              style={{
                display: "block",
                width: "84%",
                height: "100%",
              }}
            > 
              <div
                className="next-wrapper"
                onClick={function () {
                  props.queueFunc(
                    props.next[0],
                    props.total_queue.length,
                    props.isFirst
                  );
                }}
              >
                <div className="next-playing__img">
                  <img src={props.next[0].album.images[0].url} alt="player" />
                </div>
                <div className="next-playing__side">
                  <div className="next-playing__name">{props.next[0].name}</div>
                  <div className="next-playing__artist">
                    {props.next[0].artists[0].name}
                  </div>
                  <div className="next-playing_attributes" style={{ fontSize: "calc(10px + 1vmin)", overflowX: "scroll", whiteSpace: "nowrap", width: "100%"  }}>
                    {props.next_features[0]}
                  </div>
                </div>

              </div>
              <div
                className="next-wrapper"
                onClick={function () {
                  props.queueFunc(
                    props.next[1],
                    props.total_queue.length,
                    props.isFirst
                  );
                }}
              >
                <div className="next-playing__img">
                  <img src={props.next[1].album.images[0].url} alt="player" />
                </div>
                <div className="next-playing__side">
                  <div className="next-playing__name">{props.next[1].name}</div>
                  <div className="next-playing__artist">
                    {props.next[1].artists[0].name}
                  </div>
                  <div className="next-playing_attributes" style={{ fontSize: "calc(10px + 1vmin)", overflowX: "scroll", whiteSpace: "nowrap", width: "100%"   }}>
                              {props.next_features[1]}
                          </div>
                          </div>

              </div>
              <div
                className="next-wrapper"
                onClick={function () {
                  props.queueFunc(
                    props.next[2],
                    props.total_queue.length,
                    props.isFirst
                  );
                }}
              >
                <div className="next-playing__img">
                  <img src={props.next[2].album.images[0].url} alt="player" />
                </div>
                <div className="next-playing__side">
                  <div className="next-playing__name">{props.next[2].name}</div>
                  <div className="next-playing__artist">
                    {props.next[2].artists[0].name}
                  </div>
                  <div className="next-playing_attributes" style={{ fontSize: "calc(10px + 1vmin)", overflowX: "scroll", whiteSpace: "nowrap", width: "100%"   }}>
                              {props.next_features[2]}
                          </div>
                          </div>

              </div>
            </div>
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
                  src={refresh_btn}

                />
              </div> 
            </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default NextPlayer;
