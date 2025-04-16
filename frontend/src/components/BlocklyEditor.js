
// import React, { useRef, useEffect } from "react";
// import * as Blockly from "blockly";
// import { javascriptGenerator } from "blockly/javascript";
// import { jsonGenerator } from '../generators/jsonGenerator';
// import { defineCustomBlocks } from './customBlocks';

// function BlocklyEditor({ onCodeChange }) {
//   const blocklyDiv = useRef(null);

//   // ✅ Toolbox with Categories
//   const toolbox = {
//     kind: "categoryToolbox",
//     contents: [
//       {
//         kind: "category",
//         name: "Logic",
//         colour: "#5C81A6",
//         contents: [
//           { kind: "block", type: "controls_if" },
//           { kind: "block", type: "logic_compare" },
//         ],
//       },
//       {
//         kind: "category",
//         name: "Math",
//         colour: "#5CA65C",
//         contents: [
//           { kind: "block", type: "math_number" },
//         ],
//       },
//       {
//         kind: "category",
//         name: "Indicators",
//         colour: "#A65C81",
//         contents: [
//           { kind: "block", type: "rsi_block" },
//           { kind: "block", type: "sma_block" },
//         ],
//       },
//       {
//         kind: "category",
//         name: "Actions",
//         colour: "#A6745C",
//         contents: [
//           { kind: "block", type: "buy_block" },
//           { kind: "block", type: "sell_block" },
//         ],
//       },
//     ],
//   };

//   useEffect(() => {
//     defineCustomBlocks(); // ✅ Register custom blocks before injecting Blockly

//     const workspace = Blockly.inject(blocklyDiv.current, {
//       toolbox: toolbox,
//     });

//     workspace.addChangeListener(() => {
//       const json = jsonGenerator.workspaceToJson(workspace);
//       onCodeChange(JSON.stringify(json, null, 2)); // ✅ send JSON to parent
//     });

//     return () => workspace.dispose();
//   }, [onCodeChange]);

//   return <div ref={blocklyDiv} style={{ height: "400px", width: "100%" }} />;
// }

// export default BlocklyEditor;

import React, { useRef, useEffect } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { jsonGenerator } from '../generators/jsonGenerator';
import { defineCustomBlocks } from './customBlocks';

function BlocklyEditor({ onCodeChange }) {
  const blocklyDiv = useRef(null);

  // ✅ Toolbox with Categories including all indicators
  const toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: "#5CA65C",
        contents: [
          { kind: "block", type: "math_number" },
        ],
      },
      {
        kind: "category",
        name: "Indicators",
        colour: "#A65C81",
        contents: [
          { kind: "block", type: "rsi_block" },
          { kind: "block", type: "sma_block" },
          { kind: "block", type: "ema_block" },
          { kind: "block", type: "macd_block" },
          { kind: "block", type: "bollinger_block" },
          { kind: "block", type: "atr_block" },
          { kind: "block", type: "stochastic_block" },
        ],
      },
      {
        kind: "category",
        name: "Actions",
        colour: "#A6745C",
        contents: [
          { kind: "block", type: "buy_block" },
          { kind: "block", type: "sell_block" },
        ],
      },
    ],
  };

  useEffect(() => {
    defineCustomBlocks(); // ✅ Register custom blocks before injecting Blockly

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox,
    });

    workspace.addChangeListener(() => {
      const json = jsonGenerator.workspaceToJson(workspace);
      onCodeChange(JSON.stringify(json, null, 2)); // ✅ send JSON to parent
    });

    return () => workspace.dispose();
  }, [onCodeChange]);

  return <div ref={blocklyDiv} style={{ height: "400px", width: "100%" }} />;
}

export default BlocklyEditor;