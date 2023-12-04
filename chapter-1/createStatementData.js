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
    const result = Object.assign({}, aPerformance);
    // Step 14 - Move Function
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  /*
   * Step 2 - Replace Temp with Query
   */
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  /*
   * Step 1 - Extract function
   * The code will tell me what it's doing. I don't have to figure it out again.
   */
  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknow type: ${aPerformance.play.type}`);
    }
    return result;
  }

  /*
   * Step 5 - Extract function
   */
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    // add volume credits
    result += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
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
