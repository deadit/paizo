import * as math from "mathjs";

import { NetworkParameters } from "../domain/networkParameters";

export const getStepByKey = (key: keyof NetworkParameters, value: number) => {
  if (key === "storageFeeFactor") {
    return 25000;
  }

  if (key === "minValuePerByte") {
    return 10;
  }

  return Math.max(math.evaluate(`${value}/100`), 1);
};
