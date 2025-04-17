import * as Blockly from 'blockly';

export function defineCustomBlocks() {
  // ✅ RSI Block
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

  // ✅ EMA Block
  Blockly.Blocks['ema_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("EMA")
        .appendField("Period")
        .appendField(new Blockly.FieldNumber(20, 1), "PERIOD");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Exponential Moving Average");
      this.setHelpUrl("");
    },
  };

  // ✅ MACD Block
  Blockly.Blocks['macd_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("MACD")
        .appendField("Fast")
        .appendField(new Blockly.FieldNumber(12, 1), "FAST")
        .appendField("Slow")
        .appendField(new Blockly.FieldNumber(26, 1), "SLOW")
        .appendField("Signal")
        .appendField(new Blockly.FieldNumber(9, 1), "SIGNAL");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("MACD indicator");
      this.setHelpUrl("");
    },
  };

  // ✅ Bollinger Bands Block
  Blockly.Blocks['bollinger_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Bollinger Bands")
        .appendField("Period")
        .appendField(new Blockly.FieldNumber(20, 1), "PERIOD")
        .appendField("Std Dev")
        .appendField(new Blockly.FieldNumber(2, 0.1), "STDDEV");
      this.setOutput(true, "Array");
      this.setColour(230);
      this.setTooltip("Returns [Upper Band, Middle Band, Lower Band]");
      this.setHelpUrl("");
    },
  };

  // ✅ ATR Block
  Blockly.Blocks['atr_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("ATR")
        .appendField("Period")
        .appendField(new Blockly.FieldNumber(14, 1), "PERIOD");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Average True Range");
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