import React, { useEffect, useState } from "react";

import { Button, Card, Layout, List, notification, Row, Space, Typography } from "antd";
import "./App.less";
import { axiosGetFetcher } from "./api/axios";
import NetworkParametersTable from "./components/NetworkParametersTable";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { LoadingOutlined } from "@ant-design/icons";
import Pools from "./components/Pools";
import { getStepByKey } from "./utils/getStepByKet";
import { NetworkParameters } from "./domain/networkParameters";

const defaultValues = [
  { id: 1, value1: 0, value2: 0, value3: 0, poolHash: { measure: "TH/s", hashrateValue: 0 } },
  { id: 2, value1: 0, value2: 0, value3: 0, poolHash: { measure: "TH/s", hashrateValue: 0 } },
  { id: 3, value1: 0, value2: 0, value3: 0, poolHash: { measure: "TH/s", hashrateValue: 0 } },
];

const tableDefaultParams = {
  storageFeeFactor: {
    key: "storageFeeFactor",
    id: "1",
    title: "Storage fee factor (per byte storage period)",
    default: 1250000,
    min: 0,
    max: 2500000,
    isUpdated: false,
    updatedValue: 0,
  },
  minValuePerByte: {
    key: "minValuePerByte",
    id: "2",
    title: "Minimum monetary value of a box",
    default: 360,
    min: 0,
    max: 10000,
    isUpdated: false,
    updatedValue: 0,
  },
  maxBlockSize: {
    key: "maxBlockSize",
    id: "3",
    title: "Maximum block size",
    default: 524288,
    min: 16384,
    max: 1073741823,
    isUpdated: false,
    updatedValue: 0,
  },
  maxBlockCost: {
    key: "maxBlockCost",
    id: "4",
    title: "Maximum cummulative computational cost of a block",
    default: 1000000,
    min: 16384,
    max: 1073741823,
    isUpdated: false,
    updatedValue: 0,
  },
  tokenAccessCost: {
    key: "tokenAccessCost",
    id: "5",
    title: "Token access cost",
    default: 100,
    min: 0,
    max: 1073741823,
    isUpdated: false,
    updatedValue: 0,
  },
  inputCost: {
    key: "inputCost",
    id: "6",
    title: "Cost per one transaction input	",
    default: 2000,
    min: 0,
    max: 1073741823,
    isUpdated: false,
    updatedValue: 0,
  },
  dataInputCost: {
    key: "dataInputCost",
    id: "7",
    title: "Cost per one data input",
    default: 100,
    min: 0,
    max: 1073741823,
    isUpdated: false,
    updatedValue: 0,
  },
  outputCost: {
    key: "outputCost",
    id: "8",
    title: "Cost per one transaction output",
    default: 100,
    min: 0,
    max: 1073741823,
    isUpdated: false,
    updatedValue: 0,
  },
  // {
  //   key: "blockVersion",
  //   id: "120",
  //   title: "Soft-fork (increasing version of a block)	",
  // },
};

function App() {
  const [networkState, setNetworkState] = useState(null);
  const [data, setData] = useState<typeof tableDefaultParams | null>(null);
  const [pools, setPools] = useState(defaultValues);
  const [blocksMined, setBlocksMined] = useState<any>([]);
  const [epochInfo, setEpochInfo] = useState<any>([]);

  const downloadDefaultState = () => {
    axiosGetFetcher("/api/v1/networkState").then(({ params: currentNetworkState }) => {
      setNetworkState(currentNetworkState);

      const transformData = Object.values(tableDefaultParams).reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: {
            ...item,
            step: getStepByKey(
              item.key as keyof NetworkParameters,
              currentNetworkState[item.key as keyof NetworkParameters]
            ),
            value: currentNetworkState[item.key as keyof NetworkParameters],
          },
        }),
        {} as any
      );

      setData(transformData);
    });
  };

  useEffect(() => {
    downloadDefaultState();
  }, []);

  if (!data) {
    return <LoadingOutlined />;
  }

  const openNotification = (parameter: any) => {
    notification.info({
      message: `Parameter "${parameter!.title}" updated`,
    });
  };

  const handleRunEpochSimulation = () => {
    const filteredPools = pools.filter(({ poolHash: { hashrateValue } }) => hashrateValue !== 0);

    if (filteredPools.length > 0) {
      const allHashrate = filteredPools.reduce((acc, { poolHash }) => acc + poolHash.hashrateValue, 0);
      const poolHashrateByPercent = filteredPools.map(({ id, poolHash: { hashrateValue } }) => ({
        id,
        percentHashrate: hashrateValue / allHashrate,
      }));

      const selectPool = () => {
        const randomNumber = Math.random();

        let accumulatedProbability = 0;
        for (let i = 0; i < poolHashrateByPercent.length; i++) {
          accumulatedProbability += poolHashrateByPercent[i].percentHashrate;
          if (randomNumber <= accumulatedProbability) return filteredPools[i];
        }
        throw Error();
      };

      const blocksMinedBy = [];

      for (let i = 0; i < 1024; i++) {
        blocksMinedBy.push(selectPool());
      }

      const countVotesForEachParams = blocksMinedBy.reduce((acc, block) => {
        if (block.value1 !== 0) {
          acc[block.value1] = acc[block.value1] ? acc[block.value1] + 1 : 1;
        }
        if (block.value2 !== 0) {
          acc[block.value2] = acc[block.value2] ? acc[block.value2] + 1 : 1;
        }
        if (block.value3 !== 0) {
          acc[block.value3] = acc[block.value3] ? acc[block.value3] + 1 : 1;
        }
        return acc;
      }, {} as any);

      const filterParamsShouldBeUpdated = Object.keys(countVotesForEachParams).filter(
        (key) => countVotesForEachParams[key] > 512
      );

      const newEpochInfo: any = [];

      const newData = filterParamsShouldBeUpdated.reduce(
        (acc, newData) => {
          const parameter = Object.values(data).find((param) => Number(param.id) === Math.abs(Number(newData)))!;

          const step = getStepByKey(parameter.key as keyof NetworkParameters, acc[parameter.key].value);

          newEpochInfo.push({
            key: parameter.key,
            votes: countVotesForEachParams[newData],
            step: Number(newData) < 0 ? -step : step,
            title: parameter.title,
          });

          acc[parameter.key] = {
            ...acc[parameter.key],
            value: (Number(newData) < 0 ? acc[parameter.key].value - step : acc[parameter.key].value + step).toFixed(2),
            isUpdated: true,
            step: step.toFixed(2),
            updatedValue: (Number(newData) < 0
              ? acc[parameter.key].updatedValue - step
              : acc[parameter.key].updatedValue + step
            ).toFixed(2),
          };

          return acc;
        },
        { ...(data as any) }
      );

      filterParamsShouldBeUpdated.forEach((id) => {
        const parameter = Object.values(tableDefaultParams).find((param) => Number(param.id) === Math.abs(Number(id)))!;
        openNotification(parameter);
      });

      setData(newData);

      setBlocksMined(blocksMinedBy);
      setEpochInfo(newEpochInfo);
    }
  };

  const resetStateToDefault = () => {
    downloadDefaultState();
    setBlocksMined([]);
    setEpochInfo([]);
  };

  return (
    <Layout className="App">
      <Content style={{ margin: "50px 50px 100px 50px" }}>
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
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
          <NetworkParametersTable tableData={data} resetStateToDefault={resetStateToDefault} />
          <Pools parameters={data} poolsData={pools} setPoolsData={setPools} />

          <div style={{ margin: "25px 0", textAlign: "center" }}>
            <Button size="large" type="primary" onClick={handleRunEpochSimulation}>
              Run epoch simulation
            </Button>
          </div>

          {blocksMined.length !== 0 && (
            <Card>
              <Space size="small" direction="vertical">
                <Title>Output</Title>
                <Space direction="vertical">
                  <Text>Result:</Text>
                  {epochInfo.length === 0 ? (
                    <Typography.Paragraph style={{ marginBottom: "12px" }}>
                      No updates for any parameter
                    </Typography.Paragraph>
                  ) : (
                    <ul>
                      {epochInfo.map((param: any) => (
                        <li key={param.key}>
                          "{param.title}" {param.step < 0 ? "decreased" : "increased"} for {Math.abs(param.step)}. Votes
                          count {param.votes}.
                        </li>
                      ))}
                    </ul>
                  )}
                </Space>
              </Space>
              <div style={{ overflowX: "auto" }}>
                <ul style={{ display: "flex", width: "1200px", gap: "16px", padding: 0 }}>
                  {blocksMined.map((block: any, i: number) => (
                    <Card key={i} title={`Block #${i + 1}`}>
                      Mined by Pool No.{block.id}
                    </Card>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
