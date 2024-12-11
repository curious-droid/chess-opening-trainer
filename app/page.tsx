'use client'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameContainer } from '@/components/game-container'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Card className="mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Chess Opening Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <GameContainer />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
} 