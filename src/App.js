import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Table, Tag, Space } from "antd";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloProvider,
  useQuery,
} from "@apollo/client";
const axios = require("axios");

const client = new GraphQLClient({
  url: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: "Change",
    dataIndex: "change",
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: "View",
    dataIndex: "view",
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: "2",
    name: "Jim Green",
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: "3",
    name: "Joe Black",
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: "4",
    name: "Jim Red",
    chinese: 88,
    math: 99,
    english: 89,
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}

const COIN_LIST_QUERY = gql`
  query GetCoinList {
    cryptos {
      id
      name
      symbol
      quote {
        USD {
          price
          volume_24h
          percent_change_1h
          percent_change_24h
          percent_change_30d
          percent_change_7d
          market_cap
        }
      }
    }
  }
`;

function App() {
  // holds latest crypto data
  const [cryptos, setCryptos] = useState("");
  const { loading, error, data } = useQuery(COIN_LIST_QUERY);

  // get latest crypto data
  useEffect(() => {
    axios
      .get("http://localhost:4000/cryptos/latest")
      .then((response) => {
        response.status === 200
          ? console.log("✅ Request Successful ✅")
          : console.log("❌ Request failed ❌");
        console.log(response);
        console.log(response.data.data);
        setCryptos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  }, []);

  useEffect(() => {
    axios.get("/http://localhost:4000");
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error ):</p>;

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div className="Header">
          <h1>Crypto Tracker</h1>
        </div>
        <div className="MainContainer">
          <div className="CryptoList">
            <Table
              columns={columns}
              dataSource={data}
              onChange={onChange}
              key={data.id}
            />
          </div>
          <pre>{cryptos}</pre>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
