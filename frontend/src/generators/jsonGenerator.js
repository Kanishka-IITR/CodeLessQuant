import * as Blockly from 'blockly';

export const jsonGenerator = {
  workspaceToJson(workspace) {
    const topBlocks = workspace.getTopBlocks(true);
    return topBlocks.map(block => parseBlock(block)).filter(b => b !== null);
  }
};

function parseBlock(block) {
  if (!block) return null;

  switch (block.type) {
    case 'controls_if': {
      const conditionBlock = block.getInputTargetBlock('IF0');
      const doBlock = block.getInputTargetBlock('DO0');

      return {
        type: 'IF',
        condition: parseBlock(conditionBlock),
        do: parseBlock(doBlock),
      };
    }

    case 'logic_compare': {
      const operator = block.getFieldValue('OP');
      const left = parseBlock(block.getInputTargetBlock('A'));
      const right = parseBlock(block.getInputTargetBlock('B'));

      return {
        type: 'LOGIC_COMPARE',
        operator: operator,
        left: left,
        right: right
      };
    }

    case 'rsi_block': {
      const period = block.getFieldValue('PERIOD');
      return {
        type: 'RSI',
        period: parseInt(period, 10)
      };
    }

    case 'sma_block': {
      const period = block.getFieldValue('PERIOD');
      return {
        type: 'SMA',
        period: parseInt(period, 10)
      };
    }

    case 'ema_block': {
      const period = block.getFieldValue('PERIOD');
      return {
        type: 'EMA',
        period: parseInt(period, 10)
      };
    }

    case 'buy_block':
      return { type: 'BUY' };

    case 'sell_block':
      return { type: 'SELL' };

    case 'math_number': {
      const num = block.getFieldValue('NUM');
      return parseFloat(num);
    }

    default:
      return {
        type: block.type
      };
  }
}
