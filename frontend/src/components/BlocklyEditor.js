// import React, { useRef, useEffect } from "react";
// import * as Blockly from "blockly";
// import { javascriptGenerator } from "blockly/javascript";
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
//       const code = javascriptGenerator.workspaceToCode(workspace);
//       onCodeChange(code);
//     });

//     return () => workspace.dispose();
//   }, [onCodeChange]);

//   return <div ref={blocklyDiv} style={{ height: "400px", width: "100%" }} />;
// }

// export default BlocklyEditor;

// //
// // ✅ Code Generators for Custom Blocks
// //

// // RSI
// javascriptGenerator.forBlock['rsi_block'] = function (block) {
//   const period = block.getFieldValue('PERIOD');
//   const code = `rsi(${period})`;
//   return [code, javascriptGenerator.ORDER_ATOMIC];
// };

// // SMA
// javascriptGenerator.forBlock['sma_block'] = function (block) {
//   const period = block.getFieldValue('PERIOD');
//   const code = `sma(${period})`;
//   return [code, javascriptGenerator.ORDER_ATOMIC];
// };

// // BUY
// javascriptGenerator.forBlock['buy_block'] = function () {
//   return 'buy();\n';
// };

// // SELL
// javascriptGenerator.forBlock['sell_block'] = function () {
//   return 'sell();\n';
// };

import React, { useRef, useEffect } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { jsonGenerator } from '../generators/jsonGenerator';
import { defineCustomBlocks } from './customBlocks';

function BlocklyEditor({ onCodeChange }) {
  const blocklyDiv = useRef(null);

  // ✅ Toolbox with Categories
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
