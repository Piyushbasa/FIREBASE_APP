'use client';

import * as React from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewTransactionForm, Transaction } from '@/components/finance/NewTransactionForm';
import { FinanceChart } from '@/components/finance/FinanceChart';
import { TransactionList } from '@/components/finance/TransactionList';
import { Loader2 } from 'lucide-react';

export function FinanceSummary() {
    const { user } = useUser();
    const firestore = useFirestore();

    const transactionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `userProfile/${user.uid}/transactions`), orderBy('date', 'desc'));
    }, [firestore, user]);

    const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

    const { totalIncome, totalExpenses, netBalance } = React.useMemo(() => {
        if (!transactions) {
            return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
        }
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        return {
            totalIncome: income,
            totalExpenses: expenses,
            netBalance: income - expenses,
        };
    }, [transactions]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">Total Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">Total Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">Net Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-foreground' : 'text-red-600'}`}>{formatCurrency(netBalance)}</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Cash Flow</CardTitle>
                        <CardDescription>Income and expenses over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? (
                            <div className="flex justify-center items-center h-[250px]">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                       ) : (
                           <FinanceChart transactions={transactions} />
                       )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NewTransactionForm />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-[250px]">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                       ) : (
                           <TransactionList transactions={transactions} />
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
