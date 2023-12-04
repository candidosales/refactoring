import createStatementData from './createStatementData.js';

// Step 12 - Split Phase -> Extract Function
export default function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    // Step 3 - Inline Variable
    // Removes: const play = playFor(perf)
    // Removing a lot of locally scoped names.
    // The great benefit of removing local variables is that it makes it much easier to do extractions,
    // since there is less local scope to deal with. Indeed, usually I'll take out local variables
    // before I do any extractions.

    // Step 4 - Inline Variable
    // Removes: let thisAmount = amountFor(perf);
    // I look back at where it's called. It's being used to set a temporary variables that's not
    // updated again, so I apply Inline Variable

    // Step 5 - Extract function
    // volumeCredits += volumeCreditsFor(perf);

    // print line for this order
    result += ` ${perf.play.name}: ${usd(perf.amount / 100)} (${
      perf.audience
    } seats) \n`;
  }

  result += `Amount owed is ${usd(data.totalAmount / 100)} \n`;

  // Step 10 - Inline Variable
  result += `You earned ${data.totalVolumeCredits} credits \n`;
  return result;

  /*
   * Step 6 - Extract function
   */
  /*
   * Step 7 - Change Function Declaration
   * Renamed format to usd
   * "format" doesn't really convey enough of what it's doing. "formatAsUSD" would be a bit too long-winded
   * since it's being used in a string template, particularly within this small scope.
   */
  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber);
  }
}
