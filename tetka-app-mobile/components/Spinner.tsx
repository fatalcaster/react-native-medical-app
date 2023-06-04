import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface SpinnerProps {}
const Spinner = (props: SpinnerProps) => (
  <Svg className="animate-spin" viewBox="0 0 256 256" {...props}>
    <Path fill="none" d="M0 0h256v256H0z" />
    <Path
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={24}
      d="M128 32v32M224 128h-32M195.882 195.882l-22.627-22.627M128 224v-32M60.118 195.882l22.627-22.627M32 128h32M60.118 60.118l22.627 22.627"
    />
  </Svg>
);

export default Spinner;
