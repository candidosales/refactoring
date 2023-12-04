class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  /*
   * Step 1 - Extract function
   * The code will tell me what it's doing. I don't have to figure it out again.
   * Step 16 - Move function
   */
  get amount() {
    throw new Error('subclass responsability');
  }

  /*
   * Step 17 - Move function
   */
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

/*
 * Step 18 - Replace Conditional with Polymorphism
 */
class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

/*
 * Step 18 - Replace Conditional with Polymorphism
 */
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknow type: ${aPlay.type}`);
  }
}

export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

  /* Step 13
   * I take a copy because I don't want to modify the data passed into the function. I prefer treat data as immutable
   * as much as I can - mutable state quickly becomes something rotten.
   */
  function enrichPerformance(aPerformance) {
    /*
     * Step 18 - Replace Constructor with Factory Function
     */
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance),
    );
    const result = Object.assign({}, aPerformance);
    // Step 14 - Move Function
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  /*
   * Step 2 - Replace Temp with Query
   */
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  /*
   * Step 8 - Split Loop -> Slide Statements
   * Step 9 - Extract Function
   * Step 15 - Replace Loop with Pipeline
   */
  function totalVolumeCredits(data) {
    // let result = 0;
    // for (let perf of data.performances) {
    //   result += perf.volumeCredits;
    // }
    // return result;

    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  /*
   * Step 11 - Split Loop -> Slide Statements -> Extract function
   * Step 15 - Replace Loop with Pipeline
   */
  function totalAmount(data) {
    // let result = 0;
    // for (let perf of data.performances) {
    //   result += perf.amount;
    // }
    // return result;

    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
}
