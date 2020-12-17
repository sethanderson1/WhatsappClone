import React from "react";
import { View } from "../Themed";

export const CenterHorizontal: React.FC = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};
