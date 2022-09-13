import React from "react";
import play_btn from "./images/play.png";
import add_start_queue from "./images/add_start_queue.png";
import add_end_queue from "./images/add_end_queue.png";
import { List, Avatar } from "antd";

const SearchItem = (props) => {
  return (
    <List.Item
          key={props.element.uri}
          style={{ width: "100%",}}
          onClick={() => {
            if (props.total_queue?.length == 0){ 
              props.setFunc("", []);
              props.player.activateElement().then(() => {
                props.queueFunc(props.element, props.queue_pos, true);
              });
            } 
          }}
      /*    
      actions={[
        <img
          id="list_play_btn"
          alt="play song"
          src={play_btn}
          style={{
            display: props.total_queue?.length > 0 ? "none" : "block",
            width: "100%",
          }}
          onClick={() => {
            props.setFunc("", []);
            props.player.activateElement().then(() => {
              props.queueFunc(props.element, props.queue_pos, true);
            });
          }}
          
        />,
      ]}*/
      extra={[
      /*  <img
          id="list_play_btn"
          alt="play this song"
          src={play_btn}
          style={{
            display: props.total_queue?.length > 0 ? "block" : "none",
            marginRight: "3%",
            width: "12%",
          }}
          onClick={() => {
            props.setFunc("", []);
            props.player.activateElement().then(() => {
              props.queueFunc(props.element, props.queue_pos, true);
              props.playFunc();
            });
          }}
        />,*/
        <img
          id="list_queue_start_btn"
          alt="add song to start of queue"
          src={add_start_queue}
          style={{
            marginRight: "3%",
            width: "12%",
            display: props.total_queue?.length > 0 ? "block" : "none",
          }}
          onClick={() => {
            props.setFunc("", []);
            props.queueFunc(props.element, props.queue_pos + 1);
          }}
        />,
        <img
          id="list_queue_end_btn"
          alt="add song to end of queue"
          src={add_end_queue}
          style={{
            width: "12%",
            display: props.total_queue?.length > 0 ? "block" : "none",
          }}
          onClick={() => {
            props.setFunc("", []);
            props.queueFunc(props.element, props.total_queue.length);
          }}
        />,
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            shape="square"
            size="large"
            src={props.element.album.images[0].url}
          />
        }
        title={<p href="https://ant.design">{props.element.name}</p>}
        description={props.artists.join(", ")}
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      />
    </List.Item>
  );
};
export default SearchItem;
