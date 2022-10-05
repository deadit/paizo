import React, { useEffect, useState } from "react";

import { Button, Card, Layout, Row, Space } from "antd";
import "./App.less";
import { axiosGetFetcher } from "./api/axios";
import NetworkParametersTable from "./components/NetworkParametersTable";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { LoadingOutlined } from "@ant-design/icons";
import Pools from "./components/Pools";
import Paragraph from "antd/lib/skeleton/Paragraph";

function App() {
  const [data, setData] = useState(null);
  const [pools, setPools] = useState([]);

  useEffect(() => {
    axiosGetFetcher("/api/v1/networkState").then(({ params }) => setData(params));
  }, []);

  if (!data) {
    return <LoadingOutlined />;
  }

  return (
    <Layout className="App">
      <Content style={{ padding: "0 50px" }}>
        <div style={{ marginBottom: "40px", marginTop: "40px", textAlign: "center" }}>
          <Title level={1} style={{ textAlign: "center" }}>
            Paizo
          </Title>
          <Text>Tool to help you better to understand how governance on ERGO blockchain works.</Text>
        </div>
        <Space direction="vertical" size="large">
          <Card>
            <Title level={2}>Governance on ERGO</Title>
            <Text>
              Many parameters can be changed on-the-fly via miners voting, such as instructions costs, computational
              cost limit per block, block size limit, storage fee factor, block version, etc. <br />
              <br />
              Voting for the block version lasts 32 epochs and requires more than 90 percent of the miners to vote for
              the change. A simple majority is enough for less critical changes such as block size limit. We will
              further refer to the changes of the first kind as foundational changes, and we refer to the changes of the
              second kind as everyday changes. Per block, a miner can vote for two everyday changes and one foundational
              change, with the votes to be included in the block's header. <br />
              <br />
              To vote <b>Yes</b> and propose a change in the first block of an epoch, a miner is publishing the
              identifier of the change directly in the block header. To vote <b>No</b> (or avoid voting at all, which is
              the same), a miner writes zero value instead of a corresponding byte (another option is to provide a vote
              identifier not considered within the epoch). <br />
              <br />
            </Text>
            <div>
              <Button
                type="link"
                style={{ padding: "0" }}
                href="https://docs.ergoplatform.com/mining/governance/"
                target="_blank"
              >
                Check this link for more information
              </Button>
            </div>
          </Card>
          <NetworkParametersTable data={data} />
          <Pools pools={pools} />
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
