import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Card, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";

const { Text } = Typography;

const columns: ColumnsType<any> = [
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
    render: (data: number, item: any) => {
      if (item.isUpdated) {
        return (
          <Tooltip title={`This value is updated for ${item.updatedValue}`}>
            <Text mark>
              {data} <InfoCircleOutlined />
            </Text>
          </Tooltip>
        );
      }
      return data;
    },
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
  tableData: any;
  resetStateToDefault: () => void;
}

const NetworkParametersTable = ({ tableData, resetStateToDefault }: Props) => {
  return (
    <Card
      title={<Typography.Title level={2}>Network parameters</Typography.Title>}
      extra={
        <Button type="primary" onClick={resetStateToDefault}>
          Reset state
        </Button>
      }
    >
      <Table dataSource={Object.values(tableData) as any} columns={columns} pagination={false} />
    </Card>
  );
};

export default NetworkParametersTable;
