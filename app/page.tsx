'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GameContainer } from '@/components/game-container'
import { ErrorBoundary } from '@/components/error-boundary'

export default function Home() {
  return (
    <main className="container mx-auto px-1 py-1 max-w-4xl">
      <Card className="mx-auto w-full">
        <CardHeader className="text-center">
          <CardHeader className="text-center space-y-4 py-2">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Chess Opening Trainer
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-full" />
            </div>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Master your openings with interactive practice and real-time feedback
            </p>
          </CardHeader>
        </CardHeader>
        <CardContent className="p-2">
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