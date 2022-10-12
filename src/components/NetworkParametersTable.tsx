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

interface Props {
  data: NetworkParameters;
  defaultParams: (
    | {
        key: string;
        id: string;
        title: string;
        default: number;
        step: number;
        min: number;
        max: number;
      }
    | {
        key: string;
        id: string;
        title: string;
        default: number;
        min: number;
        max: number;
        step?: undefined;
      }
  )[];
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

const NetworkParametersTable = ({ data, defaultParams }: Props) => {
  const transformData = defaultParams.map((item) => ({
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
