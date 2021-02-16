import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Table, Tag, Space } from "antd";
import { gql, useQuery } from "@apollo/client";
const axios = require("axios");

const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: {
      compare: (a, b) => parseInt(a.id) - parseInt(b.id),
      sortDirections: ["Ascend", "Descend"],
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: {
      compare: (a, b) => a.symbol.localeCompare(b.symbol),
      // sortDirections: ["Ascend", "Descend", "Ascend"],
    },
  },
  {
    title: "Price",
    // dataIndex: "price",
    key: "price",
    render: (record) => {
      let price = record.quote.USD.price;

      price = formatter.format(price);
      return price;
    },
    sorter: {
      compare: (a, b) =>
        parseFloat(a.quote.USD.price) - parseFloat(b.quote.USD.price),
    },
  },
  {
    title: "Volume (24h)",
    key: "volume",
    render: (record) => {
      let vol = record.quote.USD.volume_24h;
      vol = formatter.format(vol);
      return vol;
    },
    sorter: {
      compare: (a, b) =>
        parseFloat(a.quote.USD.volume_24h) - parseFloat(b.quote.USD.volume_24h),
    },
  },
  {
    title: "Market cap",
    key: "market cap",
    render: (record) => {
      let mCap = record.quote.USD.market_cap;
      mCap = formatter.format(mCap);
      return mCap;
    },
    sorter: {
      compare: (a, b) =>
        parseFloat(a.quote.USD.market_cap) - parseFloat(b.quote.USD.market_cap),
    },
  },
  // {
  //   title: "Change",
  //   dataIndex: "change",
  //   key: "change",
  //   // sorter: {
  //   //   compare: (a, b) => a.math - b.math,
  //   //   multiple: 2,
  //   // },
  // },
  // {
  //   title: "View",
  //   dataIndex: "view",
  //   key: "view",
  // },
];

// const data = [
//   {
//     key: "1",
//     name: "John Brown",
//     chinese: 98,
//     math: 60,
//     english: 70,
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     chinese: 98,
//     math: 66,
//     english: 89,
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     chinese: 98,
//     math: 90,
//     english: 70,
//   },
//   {
//     key: "4",
//     name: "Jim Red",
//     chinese: 88,
//     math: 99,
//     english: 89,
//   },
// ];

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
  const { loading, error, data } = useQuery(COIN_LIST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error ):</p>;

  console.log(data.cryptos);

  return (
    <>
      <div className="App">
        <div className="Header">
          <h1>Crypto Tracker</h1>
        </div>
        <div className="MainContainer">
          <div className="CryptoList">
            <Table
              columns={columns}
              dataSource={data.cryptos}
              onChange={onChange}
              rowKey="id"
              pagination={{ pageSize: 25 }}
            />
          </div>
          {/* <pre>{JSON.stringify(data)}</pre> */}
        </div>
      </div>
    </>
  );
}

export default App;

// get latest crypto data
// useEffect(() => {
//   axios
//     .get("http://localhost:4000/cryptos/latest")
//     .then((response) => {
//       response.status === 200
//         ? console.log("✅ Request Successful ✅")
//         : console.log("❌ Request failed ❌");
//       console.log(response);
//       console.log(response.data.data);
//       setCryptos(response.data.data);
//     })
//     .catch((error) => {
//       console.log(error);
//     })
//     .then(() => {
//       // always executed
//     });
// }, []);
