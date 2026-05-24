import { Streamdown } from "streamdown";
import { code } from '@streamdown/code';
import { mermaid } from '@streamdown/mermaid';
import { math } from '@streamdown/math';
import { cjk } from '@streamdown/cjk';

import "streamdown/styles.css";

interface Props {
  text: string,
  status: string,
}
export function StreamedMessage({ text, status }: Props) {
  return (
    <Streamdown 
      plugins={{ 
        code, mermaid, math, cjk
      }}
      animated={{ animation: "blurIn", duration: 250, stagger: 0 }}
      isAnimating={status === "streaming"}
      mode="streaming"
    >
      {text}
    </Streamdown>
  )
}