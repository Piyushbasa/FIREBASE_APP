'use client';

import * as React from 'react';
import { Transaction } from '@/components/finance/NewTransactionForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionListProps {
    transactions: Transaction[] | null;
}

export function TransactionList({ transactions }: TransactionListProps) {
    
    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No transactions recorded yet.</p>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    }

    return (
        <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
                {transactions.map(t => (
                    <div key={t.id} className="flex items-center gap-4">
                         <div className={cn("p-2 rounded-full", t.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20')}>
                            {t.type === 'income' ? <ArrowUpRight className="h-5 w-5 text-green-600" /> : <ArrowDownLeft className="h-5 w-5 text-red-600" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{t.category}</p>
                            <p className="text-sm text-muted-foreground">{format(t.date.toDate(), 'MMM d, yyyy')}</p>
                        </div>
                        <p className={cn("font-semibold", t.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
