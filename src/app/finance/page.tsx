'use client';

import * as React from 'react';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { NewTransactionForm, Transaction } from '@/components/finance/NewTransactionForm';
import { FinanceSummary } from '@/components/finance/FinanceSummary';

export default function FinancePage() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header rightContent={<SidebarTrigger />} />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </main>
            </div>
        );
    }
    
    if (!user) {
        return (
             <div className="flex flex-col min-h-screen">
                <Header rightContent={<SidebarTrigger />} />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center p-8 border rounded-lg bg-card max-w-md">
                        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                        <p className="text-muted-foreground mb-4">You must be logged in to manage your finances.</p>
                        <Link href="/login">
                            <Button>Login or Sign Up</Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header rightContent={<SidebarTrigger />} />
            <main className="flex-1 p-4">
                <div className="mx-auto max-w-7xl">
                    <FinanceSummary />
                </div>
            </main>
        </div>
    );
}
