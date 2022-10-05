import { Card, Table } from "antd";
import * as math from "mathjs";
import { NetworkParameters } from "../domain/networkParameters";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Description",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Current value",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Step",
    dataIndex: "step",
    key: "step",
  },
  {
    title: "Min",
    dataIndex: "min",
    key: "min",
  },
  {
    title: "Max",
    dataIndex: "max",
    key: "max",
  },
  {
    title: "Default",
    dataIndex: "default",
    key: "default",
  },
];

const dataSource = [
  {
    key: "storageFeeFactor",
    id: "1",
    title: "Storage fee factor (per byte storage period)",
    default: 1250000,
    step: 25000,
    min: 0,
    max: 2500000,
  },
  {
    key: "minValuePerByte",
    id: "2",
    title: "Minimum monetary value of a box",
    default: 360,
    step: 10,
    min: 0,
    max: 10000,
  },
  {
    key: "maxBlockSize",
    id: "3",
    title: "Maximum block size",
    default: 524288,
    min: 16384,
    max: 1073741823,
  },
  {
    key: "maxBlockCost",
    id: "4",
    title: "Maximum cummulative computational cost of a block",
    default: 1000000,
    min: 16384,
    max: 1073741823,
  },
  {
    key: "tokenAccessCost",
    id: "5",
    title: "Token access cost",
    default: 100,
    min: 0,
    max: 1073741823,
  },
  {
    key: "inputCost",
    id: "6",
    title: "Cost per one transaction input	",
    default: 2000,
    min: 0,
    max: 1073741823,
  },
  {
    key: "dataInputCost",
    id: "7",
    title: "Cost per one data input",
    default: 100,
    min: 0,
    max: 1073741823,
  },
  {
    key: "inputCost",
    id: "8",
    title: "Cost per one transaction output",
    default: 100,
    min: 0,
    max: 1073741823,
  },
  {
    key: "blockVersion",
    id: "120",
    title: "Soft-fork (increasing version of a block)	",
  },
];

interface Props {
  data: NetworkParameters;
}

const getStepByKey = (key: keyof NetworkParameters, value: number) => {
  if (key === "storageFeeFactor") {
    return 25000;
  }

  if (key === "minValuePerByte") {
    return 10;
  }

  if (key === "blockVersion") {
    return null;
  }

  return Math.max(math.evaluate(`${value}/100`), 1);
};

const NetworkParametersTable = ({ data }: Props) => {
  const transformData = dataSource.map((item) => ({
    ...item,
    step: getStepByKey(item.key as keyof NetworkParameters, data[item.key as keyof NetworkParameters]),
    value: data[item.key as keyof NetworkParameters],
  }));

  return (
    <Card>
      <Table dataSource={transformData} columns={columns} pagination={false} />
    </Card>
  );
};

export default NetworkParametersTable;
