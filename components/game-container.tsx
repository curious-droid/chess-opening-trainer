'use client'

import { useState } from 'react'
import { ChessBoard } from '@/components/chess-board'
import { GameState, UploadFormData } from '@/types/chess'
import { parsePgn } from '@/utils/chess'
import toast from 'react-hot-toast'
import { LoadOpeningCard } from '@/components/load-opening-card'

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
      parsePgn(pendingPgn.pgn)
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
    <div className="grid gap-2 lg:grid-cols-[1fr_400px] md:grid-cols-1 w-full max-w-full overflow-hidden">
      <div className="space-y-4 min-w-0 w-full">
        <ChessBoard 
          gameState={gameState} 
          setGameState={setGameState}
          isPracticeMode={!!gameState}
        />
      </div>
      <div className="space-y-4 w-full min-w-0">
        <LoadOpeningCard
          onPgnChange={handlePgnChange}
          onStartTraining={handleStartTraining}
          isPgnValid={!!pendingPgn.pgn}
        />
      </div>
    </div>
  )
} 