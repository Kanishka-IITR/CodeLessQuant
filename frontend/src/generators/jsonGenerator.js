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

    case 'macd_block': {
      const fast = parseInt(block.getFieldValue('FAST'), 10);
      const slow = parseInt(block.getFieldValue('SLOW'), 10);
      return {
        type: 'MACD',
        fast,
        slow,
      };
    }

    case 'bollinger_block': {
      const period = parseInt(block.getFieldValue('PERIOD'), 10);
      const stdDev = parseFloat(block.getFieldValue('STDDEV'));
      return {
        type: 'BOLLINGER',
        period,
        stdDev,
      };
    }

    case 'atr_block': {
      const period = parseInt(block.getFieldValue('PERIOD'), 10);
      return {
        type: 'ATR',
        period,
      };
    }

    // case 'stochastic_block': {
    //   const kPeriod = parseInt(block.getFieldValue('K_PERIOD'));
    //   const dPeriod = parseInt(block.getFieldValue('D_PERIOD'));
    //   const target = block.getFieldValue('TARGET'); // "%K" or "%D"
    //   return {
    //     type: 'STOCHASTIC',
    //     kPeriod: parseInt(kPeriod),
    // dPeriod: parseInt(dPeriod),
    // target: target
    //   };
    // }
    case 'stochastic_block': {
      const kPeriod = block.getFieldValue('KPERIOD');
      const dPeriod = block.getFieldValue('DPERIOD');
      const target = block.getFieldValue('TARGET'); // Capture the target value
      
      // Use a fallback if target is invalid
      const parsedTarget = (target && !isNaN(target)) ? parseInt(target, 10) : 80; // Default to 80 if invalid
    
      return {
        type: 'STOCHASTIC',
        kPeriod: parseInt(kPeriod, 10),
        dPeriod: parseInt(dPeriod, 10),
        target: parsedTarget // Ensure target is not null
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