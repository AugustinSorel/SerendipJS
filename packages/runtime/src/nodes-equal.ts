import { VNodes } from "./h";

export const areNodesEqual = (nodeOne: VNodes, nodeTwo: VNodes) => {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }

  if (nodeOne.type === "element" && nodeTwo.type === "element") {
    return nodeOne.tagName === nodeTwo.tagName;
  }

  return true;
};
