import React, { useEffect, useState } from "react";
import moment from "moment";
import Sigma, { RelativeSize, SigmaEnableWebGL } from "react-sigma";
import square from "./square.json";
import "./App.css";
import MySigma from "./MySigma";
import RandomizeNodePositions from "react-sigma/lib/RandomizeNodePositions";

const App = () => {
  const initialGraph = square;
  initialGraph.timestamp = moment().unix();

  const [graph, setGraph] = useState(square);
  const handleGraphChange = () => {
    try {
      let data = JSON.parse(text);
      data.timestamp = moment().unix();
      setGraph(data);
    } catch (e) {
      //TODO: warn user of invalid input
      console.log("invalid JSON");
      console.log(e);
    }
  };

  const [text, setText] = useState();
  const handleTextChange = e => {
    setText(e.target.value);
  };

  const debug = () => {
    console.log(graph);
    console.log(text);
    console.log();
  };

  return (
    <div className="App">
      <div id="header">
        <div id="title" className="h1">
          Sigma test
        </div>
      </div>
      {/* 
        //TODO: Prettify the look 
      */}
      <div id="UI">
        <textarea
          cols="50"
          rows="30"
          value={text}
          onChange={handleTextChange}
        />
        <button value="Upload" onClick={handleGraphChange}>
          Upload
        </button>
        <button onClick={debug}>Debug</button>
      </div>
      <div id="graph">
        <Sigma
          style={{ background: "#fcfcfc", height: "100%" }}
          settings={{
            drawEdges: true,
            clone: true,
            immutable: false,
            /* defaultEdgeColor: "#4d4e4f",
            defaultNodeColor: "#4d4e4f", */
            edgeColor: "default",
            touchEnabled: false,
            mouseEnabled: false,
            sideMargin: 1
          }}
        >
          <MySigma graph={graph}>
            <RelativeSize initialSize={15} key={graph.timestamp} />
          </MySigma>
        </Sigma>
      </div>
    </div>
  );
};

export default App;
