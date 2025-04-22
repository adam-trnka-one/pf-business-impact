import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, calculateRevenueImpact } from "@/utils/conversionCalculator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ConversionCalculator = () => {
  const [trialUsersPerMonth, setTrialUsersPerMonth] = useState<number>(500);
  const [trialConversionRate, setTrialConversionRate] = useState<number>(0.1);
  const [averageRevenuePerUser, setAverageRevenuePerUser] = useState<number>(50);
  const [conversionRateUplift, setConversionRateUplift] = useState<number>(0.25);

  const revenueImpact = calculateRevenueImpact({
    trialUsersPerMonth,
    trialConversionRate,
    averageRevenuePerUser,
    conversionRateUplift,
  });

  const {
    currentMonthlyRevenue,
    potentialMonthlyRevenue,
    monthlyRevenueIncrease,
    netYearlyRevenueIncrease,
  } = revenueImpact;

  return (
    <Card>
      <CardContent>
        <div className="grid gap-4">
          <div className="calculator-input">
            <Label htmlFor="trialUsersPerMonth" className="calculator-label">
              Trial users per month
            </Label>
            <Input
              type="number"
              id="trialUsersPerMonth"
              value={trialUsersPerMonth}
              onChange={(e) => setTrialUsersPerMonth(Number(e.target.value))}
            />
          </div>

          <div className="calculator-input">
            <Label htmlFor="trialConversionRate" className="calculator-label">
              Current trial conversion rate
            </Label>
            <Input
              type="number"
              id="trialConversionRate"
              value={trialConversionRate}
              onChange={(e) => setTrialConversionRate(Number(e.target.value))}
            />
          </div>

          <div className="calculator-input">
            <Label htmlFor="averageRevenuePerUser" className="calculator-label">
              Average revenue per user
            </Label>
            <Input
              type="number"
              id="averageRevenuePerUser"
              value={averageRevenuePerUser}
              onChange={(e) => setAverageRevenuePerUser(Number(e.target.value))}
            />
          </div>

          <div className="calculator-input">
            <Label htmlFor="conversionRateUplift" className="calculator-label">
              Potential conversion rate uplift
            </Label>
            <Input
              type="number"
              id="conversionRateUplift"
              value={conversionRateUplift}
              onChange={(e) => setConversionRateUplift(Number(e.target.value))}
            />
          </div>
        </div>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Current monthly revenue</TableCell>
              <TableCell className="text-right">
                {formatCurrency(currentMonthlyRevenue)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Potential monthly revenue</TableCell>
              <TableCell className="text-right">
                {formatCurrency(potentialMonthlyRevenue)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly revenue increase</TableCell>
              <TableCell className="text-right font-bold text-green-600">
                {formatCurrency(monthlyRevenueIncrease)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center font-medium">Net ARR increase</TableCell>
              <TableCell className="text-right font-bold text-green-600">
                {formatCurrency(netYearlyRevenueIncrease)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center font-medium">Net yearly revenue increase</TableCell>
              <TableCell className="text-right font-bold text-green-600">
                {formatCurrency(netYearlyRevenueIncrease)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ConversionCalculator;
