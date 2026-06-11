'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';

export default function ImportacaoPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      
      <main className="flex-1 p-6 flex flex-col justify-center items-center">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <CardTitle>Importação de Extrato</CardTitle>
            <CardDescription>
              Área para importação de extratos bancários e faturas de cartão.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              A tela de importação de extratos está sendo configurada.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
