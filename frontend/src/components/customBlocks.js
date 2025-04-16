import * as Blockly from 'blockly';

export function defineCustomBlocks() {
  // RSI Block
  Blockly.Blocks['rsi_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("RSI")
        .appendField("Period")
        .appendField(new Blockly.FieldNumber(14, 1), "PERIOD");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Calculates RSI");
      this.setHelpUrl("");
    },
  };

  // ✅ SMA Block
  Blockly.Blocks['sma_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("SMA")
        .appendField("Period")
        .appendField(new Blockly.FieldNumber(20, 1), "PERIOD");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Simple Moving Average");
      this.setHelpUrl("");
    },
  };

  // ✅ Buy Block
  Blockly.Blocks['buy_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("BUY");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Place a buy order");
      this.setHelpUrl("");
    },
  };

  // ✅ Sell Block
  Blockly.Blocks['sell_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("SELL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(0);
      this.setTooltip("Place a sell order");
      this.setHelpUrl("");
    },
  };
}