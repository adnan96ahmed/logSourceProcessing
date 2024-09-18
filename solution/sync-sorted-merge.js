'use strict';
const MinHeap = require('heap'); // Using a min-heap to sort logs by date

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const heap = new MinHeap((a, b) => a.log.date - b.log.date);
  logSources.forEach((source, index) => {
    const log = source.pop();
    if (log) {
      heap.push({ log, index });
    }
  });

  while (!heap.empty()) {
    const { log, index } = heap.pop();
    printer.print(log);
    const nextLog = logSources[index].pop();
    if (nextLog) {
      heap.push({ log: nextLog, index });
    }
  }

  printer.done();
  return console.log('Sync sort complete.');
};
