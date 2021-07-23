// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var express = require('express');
var cors  = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

import { testdata }  from './testdata.js';
import { issues }  from './issues.js';
import { MetaverseDataSet } from './data/MetaverseDataSet.js';
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String,
    hello2: String,
    getIssues: [ Issue ],
    getTests: [ Test ],
    getMetaverses: [ Metaverse ],
  }

  type Test {
    property: String,
  }

  type Issue {
    title: String,
    number: String
  }

  type Metaverse {
    name: String,
    website: String,
    characteristics: [ Characteristic ]
  }

  type Characteristic {
    style: String
  }

`);

let Tests = [
  {property: 'yay'},
  {property:'yay2'}
];

let Issues = [
  {title:'title1',number:'number1'},
  {title:'title2',number:'number2'},
  {title:'title3',number:'number3'}
];

/** 
let Metaverses = [
  {name: "decentraland"},
  {name: "The Sandbox"}
];
*/

const Metaverses = MetaverseDataSet.metaverseDataSet;
 
console.log(MetaverseDataSet);


// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  hello2: () => {
    return [{name:'name1'}]
    //return JSON.stringify(testdata);
  },
  getIssues: () => Issues,
  testLink: () => links,
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
  getTests: () => Tests,
  getMetaverses: () => {
    return Metaverses;
  },
};



const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }`;


let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}];

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 2
    feed: () => links,
  },
  // 3
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  }
}
 
var app = express();
app.use(cors()); //enable CORS!

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');