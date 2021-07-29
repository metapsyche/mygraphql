// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var express = require('express');
var cors  = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

import { MetaverseDataSet } from './data/MetaverseDataSet.js';
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    getMetaverses: [ Metaverse ],
    getMetaverse: Metaverse
  }

  type Metaverse {
    id: ID,
    name: String,
    website: String,
    description: String
    characteristics: [ Characteristic ]
  }

  type Characteristic {
    style: String
  }

`);

const Metaverses = MetaverseDataSet.metaverseDataSet;
 
console.log(MetaverseDataSet);

// The root provides a resolver function for each API endpoint
var root = {
  getMetaverses: () => {
    return Metaverses;
  },
  getMetaverse: (id) => {
    return Metaverses[0];
  }
};
 
var app = express();
app.use(cors()); //enable CORS!

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');