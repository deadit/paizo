import { Alert, Button, Card, Input, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";

type Props = {
  poolsData: any;
  setPoolsData: any;
};

const poolValidation = (value1: number, value2: number, value3: number) => {
  if (Math.abs(value1) === Math.abs(value2) && value1 !== 0) {
    return "Pool can't vote for two same parameters";
  }

  if (Math.abs(value2) === Math.abs(value3) && value2 !== 0) {
    return "Pool can't vote for two same parameters";
  }
};

const Pools = ({ poolsData, setPoolsData }: Props) => {
  const updateValue = (
    index: number,
    valueKey: "value1" | "value2" | "value3",
    operation = "increase",
    currentValue: number
  ) => {
    let result = 0;

    if (operation === "increase") {
      if (currentValue === -120) {
        result = -8;
      } else {
        result = currentValue === 8 ? 120 : currentValue + 1;
      }
    } else {
      if (currentValue === 120) {
        result = 8;
      } else {
        result = currentValue === -8 ? -8 : currentValue - 1;
      }
    }
    const currentPoolValues = poolsData[index];

    setPoolsData([
      ...poolsData.slice(0, index),
      { ...currentPoolValues, [valueKey]: result },
      ...poolsData.slice(index + 1),
    ]);
  };

  const updateHashrate = (index: number, value: string) => {
    const currentPoolValues = poolsData[index];

    setPoolsData([
      ...poolsData.slice(0, index),
      { ...currentPoolValues, poolHash: { ...currentPoolValues.poolHash, hashrateValue: Number(value) } },
      ...poolsData.slice(index + 1),
    ]);
  };

  return (
    <Card title="Pools" bordered={false}>
      {poolsData.map(({ id, value1, value2, value3, poolHash: { measure, hashrateValue } }: any, i: number) => (
        <Card.Grid key={id} hoverable={false} style={{ textAlign: "center" }}>
          <Space direction="vertical" size={24}>
            <Title level={4} style={{ margin: 0 }}>
              Pool No. {i + 1}
            </Title>
            <Space direction="vertical" size="large">
              <Space>
                <Button onClick={() => updateValue(i, "value1", "decrease", value1)} disabled={value1 === -8}>
                  -
                </Button>
                {value1}
                <Button onClick={() => updateValue(i, "value1", "increase", value1)} disabled={value1 === 120}>
                  +
                </Button>
              </Space>
              <Space>
                <Button onClick={() => updateValue(i, "value2", "decrease", value2)} disabled={value2 === -8}>
                  -
                </Button>
                {value2}
                <Button onClick={() => updateValue(i, "value2", "increase", value2)} disabled={value2 === 120}>
                  +
                </Button>
              </Space>
              <Space>
                <Button onClick={() => updateValue(i, "value3", "decrease", value3)} disabled={value3 === -8}>
                  -
                </Button>
                {value3}
                <Button onClick={() => updateValue(i, "value3", "increase", value3)} disabled={value3 === 120}>
                  +
                </Button>
              </Space>
              <Space>
                <Title level={5} style={{ fontWeight: 400, marginBottom: 0 }}>
                  Hashrate
                </Title>
                <Input
                  type="number"
                  onChange={(event) => updateHashrate(i, event.currentTarget.value)}
                  value={hashrateValue}
                />
              </Space>
            </Space>
            {poolValidation(value1, value2, value3) && (
              <Alert type="error" description={poolValidation(value1, value2, value3)}></Alert>
            )}
            <div>
              <Text>
                Result: [{value1}, {value2}, {value3}]
              </Text>
            </div>
          </Space>
        </Card.Grid>
      ))}
    </Card>
  );
};

export default Pools;
