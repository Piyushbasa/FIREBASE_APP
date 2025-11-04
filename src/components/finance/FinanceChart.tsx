
'use client';

import * as React from 'react';
import { Transaction } from '@/components/finance/NewTransactionForm';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface FinanceChartProps {
    transactions: Transaction[] | null;
}

export function FinanceChart({ transactions }: FinanceChartProps) {
    const chartData = React.useMemo(() => {
        if (!transactions) return [];

        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        const daysInMonth = eachDayOfInterval({ start, end });

        return daysInMonth.map(day => {
            const dailyIncome = transactions
                .filter(t => t.type === 'income' && isSameDay(t.date.toDate(), day))
                .reduce((sum, t) => sum + t.amount, 0);
            
            const dailyExpenses = transactions
                .filter(t => t.type === 'expense' && isSameDay(t.date.toDate(), day))
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                name: format(day, 'd'),
                income: dailyIncome,
                expense: dailyExpenses,
            };
        });
    }, [transactions]);
    
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
                 <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                    cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
