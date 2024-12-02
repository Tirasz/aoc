import { Result, Solution } from '../types';


export default class DayTwo extends Solution {

  private getInputReports(input: string) {
    return input.split('\n').map(line => line.split(' ').map(Number));
  }

  private isReportSafe(report: number[], MAX_DIFF = 3) {
    const initialDiff = report[0] - report[1];
    if (Math.abs(initialDiff) > MAX_DIFF || initialDiff == 0) {
      return false;
    }
    return report.slice(1).reduce(
      (safetyInfo, value) => {
        const diff = safetyInfo.previousValue - value;
        return {
          previousValue: value,
          isSafe: safetyInfo.isSafe && Math.abs(diff) <= MAX_DIFF && Math.sign(initialDiff) === Math.sign(diff),
        }
      },
      { previousValue: report[0], isSafe: true }
    ).isSafe;
  }

  firstHalf(input: string): Result {
    const inputReports = this.getInputReports(input);
    return inputReports.reduce((safeReports, report) => safeReports + (this.isReportSafe(report) ? 1 : 0), 0);
  }

  secondHalf(input: string): Result {
    let result = 0;
    const inputReports = this.getInputReports(input).filter(report => {
      const isSafe = this.isReportSafe(report);
      result += isSafe ? 1 : 0;
      return !isSafe;
    });
    return inputReports.reduce((acc, report) => {
      for (let i = 0; i < report.length; i++) {
        const reportCopy = [...report];
        reportCopy.splice(i, 1);
        if (this.isReportSafe(reportCopy)) {
          return acc + 1;
        }
      }
      return acc;
    }, result);
  }

}