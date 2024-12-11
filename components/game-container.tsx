'use client'

import { useState } from 'react'
import { PgnUploadForm } from '@/components/pgn-upload-form'
import { ChessBoard } from '@/components/chess-board'
import { GameState, UploadFormData } from '@/types/chess'
import { parsePgn } from '@/utils/chess'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'

export function GameContainer() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [pendingPgn, setPendingPgn] = useState<Partial<UploadFormData>>({
    pgn: '',
    playerColor: 'w'
  })

  const handlePgnChange = (data: Partial<UploadFormData>) => {
    setPendingPgn(prev => ({ ...prev, ...data }))
  }

  const handleStartTraining = () => {
    if (!pendingPgn.pgn || !pendingPgn.playerColor) {
      toast.error('Please enter PGN and select a color')
      return
    }

    try {
      parsePgn(pendingPgn.pgn) // Validate PGN
      setGameState({
        pgn: pendingPgn.pgn,
        playerColor: pendingPgn.playerColor,
        currentMoveIndex: 0,
        correctMoves: 0,
        wrongMoves: 0,
        attemptsLeft: 3,
        isGameOver: false
      })
    } catch {
      toast.error('Invalid PGN format. Please check your input.')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px] md:grid-cols-1">
      <div className="space-y-4 min-w-0">
        <ChessBoard 
          gameState={gameState} 
          setGameState={setGameState}
          isPracticeMode={!!gameState}
        />
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h3 className="font-medium mb-2">Load Opening</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 mb-4">
              <h4 className="font-medium mb-2">Instructions</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Upload or paste a PGN file of the opening you want to practice</li>
                <li>• Choose which color you want to play as</li>
                <li>• You get 3 attempts for each move</li>
                <li>• After 3 wrong attempts, the correct move will be shown</li>
                <li>• Practice until you can complete the opening without mistakes!</li>
              </ul>
            </div>
            <PgnUploadForm 
              onSubmit={() => {}} 
              onChange={handlePgnChange}
            />
            <Button 
              onClick={handleStartTraining}
              disabled={!pendingPgn.pgn}
              className="w-full"
            >
              Start Training
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 