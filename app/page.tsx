'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameContainer } from '@/components/game-container'
import { ErrorBoundary } from '@/components/error-boundary'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle>Chess Opening Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary
              fallback={
                <div className="p-4 text-red-500">
                  Something went wrong with the chess board. 
                  <button 
                    onClick={() => window.location.reload()}
                    className="ml-2 underline"
                  >
                    Reload
                  </button>
                </div>
              }
            >
              <GameContainer />
            </ErrorBoundary>
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
} 