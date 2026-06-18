import fs from 'fs';
import path from 'path';
import { runMetrics } from './runMetrics';

export function saveDashboardRow() {

    const reportDir = path.join(process.cwd(), 'reports');

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir);
    }

    const filePath = path.join(
        reportDir,
        'executive-dashboard.csv'
    );

    if (!fs.existsSync(filePath)) {

        fs.writeFileSync(
            filePath,

`Scenario,SelfHealing,LocatorRefresh,AIInvocations,HealedLocators,Result,Time
`
        );
    }

    const row = [
        runMetrics.scenario,
        runMetrics.selfHealing ? 'ON' : 'OFF',
        runMetrics.locatorRefresh ? 'ON' : 'OFF',
        runMetrics.aiInvocations,
        runMetrics.healedLocators,
        runMetrics.status,
        `${runMetrics.executionTimeSec}s`
    ].join(',');

    fs.appendFileSync(filePath, row + '\n');
}
