'use strict';
const MinHeap = require('heap'); // Using a min-heap to sort logs by date

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const heap = new MinHeap((a, b) => a.log.date - b.log.date);
  await Promise.all(
    logSources.map(async (source, index) => {
      const log = await source.popAsync();
      if (log) {
        heap.push({ log, index });
      }
    })
  );

  while (!heap.empty()) {
    const { log, index } = heap.pop();
    printer.print(log);
    const nextLog = await logSources[index].popAsync();
    if (nextLog) {
      heap.push({ log: nextLog, index });
    }
  }

  printer.done();
  return new Promise((resolve, reject) => {
    resolve(console.log('Async sort complete.'));
  });
};
