import React, { useEffect, useState } from "react";
import moment from "moment";
import Sigma, { RelativeSize } from "react-sigma";
import square from "./square.json";
import "./App.css";
import MySigma from "./MySigma";
import { isString } from "util";

const App = () => {
  const initialGraph = square;
  initialGraph.timestamp = moment().unix();

  const [graph, setGraph] = useState(initialGraph);
  const handleGraphChangeFromText = () => {
    try {
      let data = JSON.parse(text);
      data.timestamp = moment().unix();
      setGraph(data);
    } catch (e) {
      alert("invalid JSON");
      console.log(e);
    }
  };

  const handleGraphChangeFromSimple = newGraph => {
    try {
      newGraph.timestamp = moment().unix();
      setGraph(newGraph);
      console.log(graph);
    } catch (e) {
      alert("invalid JSON");
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

  const handleNewNode = e => {
    let newId = document.getElementById("node-id").value;
    if (
      !isString(newId) ||
      newId === "" ||
      graph.nodes.some(element => {
        return element.id === newId;
      })
    ) {
      alert("invalid node id given");
      return;
    }
    let newLabel = document.getElementById("node-label").value;
    if (
      !isString(newLabel) ||
      newLabel === "" ||
      graph.nodes.some(element => {
        return element.label === newLabel;
      })
    ) {
      alert("invalid node label given");
      return;
    }
    let x = 0;
    let y = 0;
    try {
      x = Number.parseInt(document.getElementById("node-x").value);
      y = Number.parseInt(document.getElementById("node-y").value);
    } catch (e) {
      alert("invalid x or y coordinate");
      return;
    }
    let node = {
      id: newId,
      label: newLabel,
      x: isNaN(x) ? 0 : x,
      y: isNaN(y) ? 0 : y
    };
    let newGraph = cloneGraph();
    newGraph.nodes.push(node);
    handleGraphChangeFromSimple(newGraph);
  };

  const handleNewEdge = e => {
    let newId = document.getElementById("edge-id").value;
    if (
      !isString(newId) ||
      newId === "" ||
      graph.edges.some(element => {
        return element.id === newId;
      })
    ) {
      alert("invalid edge id given");
      return;
    }

    let newLabel = document.getElementById("edge-label").value;
    if (
      !isString(newLabel) ||
      newLabel === "" ||
      graph.edges.some(element => {
        return element.label === newLabel;
      })
    ) {
      alert("invalid edge label given");
      return;
    }

    let newSource = document.getElementById("edge-source").value;
    let newTarget = document.getElementById("edge-target").value;
    if (
      graph.edges.some(e => {
        return (
          (e.source === newSource && e.target === newTarget) ||
          (e.source === newTarget && e.target === newSource)
        );
      })
    ) {
      alert("invalid edge, already in the graph");
      return;
    }

    let edge = {
      id: newId,
      label: newLabel,
      source: newSource,
      target: newTarget
    };
    let newGraph = cloneGraph();
    newGraph.edges.push(edge);
    handleGraphChangeFromSimple(newGraph);
  };

  const cloneGraph = () => {
    return { ...graph };
  };

  const getOptions = () => {
    let options = [];
    graph.nodes.forEach(e => {
      options.push(
        <option value={e.id} key={e.id}>
          {e.label}
        </option>
      );
    });
    return options;
  };

  const handleInputToggle = e => {
    document.getElementById("UI-simple").classList.toggle("hidden");
    document.getElementById("UI-textarea").classList.toggle("hidden");
  };

  const handleNodeClick = e => {
    let newGraph = cloneGraph();

    //remove edges with node
    let edges = newGraph.edges.filter(edge => {
      return edge.source === e.data.node.id || edge.target === e.data.node.id;
    });

    edges.forEach(edge => {
      let edgeIndex = newGraph.edges.indexOf(edge);
      newGraph.edges.splice(edgeIndex, 1);
    });

    let index = newGraph.nodes.findIndex(element => {
      return element.id === e.data.node.id;
    });

    //remove node
    newGraph.nodes.splice(index, 1);

    //set new graph
    handleGraphChangeFromSimple(newGraph);
  };

  return (
    <div className="App">
      <div id="header">
        <button id="input-toggle" onClick={handleInputToggle}>
          Toggle Input Method
        </button>
        <div id="title" className="h1">
          Sigma test
        </div>
      </div>
      {/* 
        //TODO: Prettify the look 
      */}
      <div id="UI-simple" className="UI">
        <div className="input-section">
          <h2>Nodes</h2>
          <h4>Current Nodes: </h4>
          <div className="list">
            {graph.nodes.map(e => {
              return <h5 key={e.id}>{`${e.label} (${e.x}, ${e.y})`}</h5>;
            })}
          </div>
          <div className="extend-graph-form">
            <div className="form-Item">
              <label htmlFor="node-id">Id</label>
              <input
                id="node-id"
                type="text"
                placeholder="Id"
                size="16"
                required={true}
              />
            </div>
            <div className="form-Item">
              <label htmlFor="node-label">Label</label>
              <input
                id="node-label"
                type="text"
                placeholder="Label"
                size="16"
                required={true}
              />
            </div>
            <div className="form-Item">
              <label htmlFor="node-x">x</label>
              <input
                id="node-x"
                type="number"
                placeholder="x"
                required={true}
              />
            </div>
            <div className="form-Item">
              <label htmlFor="node-y">y</label>
              <input
                id="node-y"
                type="number"
                placeholder="y"
                required={true}
              />
            </div>
          </div>
          <button type="submit" onClick={handleNewNode}>
            newNode
          </button>
        </div>
        <div className="input-section">
          <h2>Edges</h2>
          <p>Current Edges: []</p>
          <div className="extend-graph-form">
            <div className="form-Item">
              <label htmlFor="edge-id">Id</label>
              <input
                id="edge-id"
                type="text"
                placeholder="Id"
                size="16"
                required={true}
              />
            </div>
            <div className="form-Item">
              <label htmlFor="edge-label">Label</label>
              <input
                id="edge-label"
                type="text"
                placeholder="Label"
                size="16"
              />
            </div>
            <div className="form-Item">
              <label htmlFor="edge-source">Source</label>
              <select id="edge-source" name="Source" required={true}>
                {getOptions()}
              </select>
            </div>
            <div className="form-Item">
              <label htmlFor="edge-target">Target</label>
              <select id="edge-target" name="Target" required={true}>
                {getOptions()}
              </select>
            </div>
          </div>
          <button type="submit" onClick={handleNewEdge}>
            newEdge
          </button>
        </div>
      </div>
      <div id="UI-textarea" className="UI hidden">
        <textarea
          cols="50"
          rows="30"
          value={text}
          onChange={handleTextChange}
        />
        <button value="Upload" onClick={handleGraphChangeFromText}>
          Upload
        </button>
        <button onClick={debug}>Debug</button>
      </div>
      <div id="graph">
        <Sigma
          renderer="canvas"
          style={{ background: "#fcfcfc", height: "100%" }}
          settings={{
            drawEdges: true,
            clone: false,
            immutable: false,
            defaultNodeColor: "#e74c3c",
            edgeColor: "source",
            touchEnabled: false,
            mouseEnabled: true,
            drawEdgeLabels: true,
            labelThreshold: 100,
            minNodeSize: 5,
            maxNodeSize: 5,
            sideMargin: 1,
            zoomMax: 1,
            zoomMin: 0.5,
            defaultLabelSize: 15,
            edgeHoverSizeRatio: 10,
            enableEdgeHovering: true,
            edgeHoverExtremities: true
          }}
          onClickNode={handleNodeClick}
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
