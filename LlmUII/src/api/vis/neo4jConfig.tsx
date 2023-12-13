import NeoVis, { NeovisConfig } from "neovis.js";

export const createConfig = (
  containerId: string,
  serverDatabase: string,
  serverURI: string,
  serverUser: string,
  serverPassword: string
) => {
  var config: NeovisConfig = {
    containerId: containerId,
    // neo4j database connection settings
    serverDatabase: "neo4j", // specify which database to read from
    neo4j: {
      // serverUrl: "bolt://54.210.222.205:7687",
      serverUrl: "bolt://localhost:7687",
      serverUser: "neo4j",
      serverPassword: "Pass@123",
      // driverConfig: {
      //     // enforce encryption
      //     // https://stackoverflow.com/questions/71719427/how-to-visualize-remote-neo4j-auradb-with-neovis-js
      //     encrypted: "ENCRYPTION_ON",
      //     trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
      // },
    },
    // override the default vis.js settings
    // https://visjs.github.io/vis-network/docs/network/#options
    visConfig: {
      nodes: {
        shape: "dot",
        borderWidth: 4,
        color: {
          background: "lightgray",
          border: "gray",
          highlight: {
            border: "#a42a04",
            background: "lightgray",
          },
        },
        font: {
          strokeWidth: 7.5,
        },
      },
      edges: { arrows: { to: { enabled: true } } },
      physics: {
        enabled: true,
        // use the forceAtlas2Based solver to compute node positions
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -75,
        },
        repulsion: {
          centralGravity: 0.01,
          springLength: 200,
        },
      },
      interaction: { multiselect: true }, // allows for multi-select using a long press or cmd-click
      layout: { randomSeed: 1337 },
    },
    // node and edge settings
    labels: {
      ASV_ID: { label: "name" },
      Class: { label: "name" },
      Condition: { label: "name" },
      Experiment: { label: "name" },
      Family: { label: "name" },
      Genus: { label: "name" },
      HMT: { label: "name" },
      Incubation: { label: "name" },
      Kingdom: { label: "name" },
      Location: { label: "name" },
      Media: { label: "name" },
      Order: { label: "name" },
      Phylum: { label: "name" },
      Sample: { label: "id" },
      SampleID: { label: "name" },
      Sequence: { label: "name" },
      Species: { label: "name" },
      OTU: { label: "id" },
      OTUNode: { label: "id" },
      SampleGroup: { label: "id" },
      TaxonomyNode: { label: "id" },
    },
    relationships: {},
    initialCypher: "MATCH (n)-[r]->(m) RETURN n, r,m limit 100",
  };
  const vis: NeoVis = new NeoVis(config);
  return vis;
};
