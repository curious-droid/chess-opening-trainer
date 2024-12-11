'use client'

import { useEffect, useState, Dispatch, SetStateAction, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import type { Square as ChessboardSquare, Piece } from 'react-chessboard/dist/chessboard/types'
import { Chess } from 'chess.js'
import { Button } from '@/components/ui/button'
import { GameState } from '@/types/chess'
import { validateMove } from '@/utils/chess'
import toast from 'react-hot-toast'

interface ChessBoardProps {
  gameState: GameState | null
  setGameState: Dispatch<SetStateAction<GameState | null>>
  isPracticeMode: boolean
}

export function ChessBoard({ gameState, setGameState, isPracticeMode }: ChessBoardProps) {
  const [game, setGame] = useState<Chess | null>(null)
  const [currentPosition, setCurrentPosition] = useState<string | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [allMoves, setAllMoves] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white')
  const [currentAttempts, setCurrentAttempts] = useState(3)
  const [showingCorrectMove, setShowingCorrectMove] = useState(false)

  const handleGameOver = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev
      return { ...prev, isGameOver: true }
    })
    toast.success('Training complete!')
  }, [setGameState])

  // Initialize the board and load PGN
  useEffect(() => {
    if (!gameState) {
      const newGame = new Chess()
      setGame(newGame)
      setCurrentPosition(newGame.fen())
      setIsLoading(false)
      return
    }

    try {
      // Load PGN and get all moves
      const tempGame = new Chess()
      tempGame.loadPgn(gameState.pgn)
      const moves = tempGame.history() as string[]
      setAllMoves(moves)

      // Set up initial position
      const newGame = new Chess()
      for (let i = 0; i < gameState.currentMoveIndex; i++) {
        newGame.move(moves[i])
      }

      setGame(newGame)
      setCurrentPosition(newGame.fen())
      setBoardOrientation(gameState.playerColor === 'b' ? 'black' : 'white')

      // Set player turn based on color and current move
      const isPlayerTurnNow = gameState.currentMoveIndex % 2 === 0 
        ? gameState.playerColor === 'w'
        : gameState.playerColor === 'b'
      setIsPlayerTurn(isPlayerTurnNow)

      // If playing as black and it's the first move, trigger computer move
      if (gameState.playerColor === 'b' && gameState.currentMoveIndex === 0) {
        setIsPlayerTurn(false)
      }

      setIsLoading(false)
    } catch {
      toast.error('Invalid PGN format')
      setGameState(null)
    }
  }, [gameState, setGameState])

  // Handle computer moves
  useEffect(() => {
    if (!isPlayerTurn && game && gameState && !gameState.isGameOver) {
      const makeComputerMove = () => {
        if (!game || !gameState) return

    if (gameState.currentMoveIndex >= allMoves.length) {
      handleGameOver()
      return
    }

        try {
          const nextMove = allMoves[gameState.currentMoveIndex]
          game.move(nextMove)
          setCurrentPosition(game.fen())
          setGameState(prev => {
            if (!prev) return prev
            return {
              ...prev,
              currentMoveIndex: prev.currentMoveIndex + 1
            }
          })
          setIsPlayerTurn(true)
        } catch {
          toast.error('Invalid move in PGN')
          setGameState(null)
        }
      }

      const timer = setTimeout(makeComputerMove, 500)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, game, gameState, allMoves, setGameState, setCurrentPosition, setIsPlayerTurn, handleGameOver])

  function onDrop(
    sourceSquare: ChessboardSquare,
    targetSquare: ChessboardSquare,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _piece: Piece
  ): boolean {
    if (!isPracticeMode || !game || !gameState || !isPlayerTurn) return false
    
    if (showingCorrectMove) {
      return false
    }

    if (gameState.currentMoveIndex >= allMoves.length) {
      handleGameOver()
      return false
    }

    const moveString = `${sourceSquare}${targetSquare}`
    const expectedMove = allMoves[gameState.currentMoveIndex]

    try {
      if (validateMove(game, moveString, expectedMove)) {
        // Correct move
        game.move(moveString)
        setCurrentPosition(game.fen())
        setIsPlayerTurn(false)
        setCurrentAttempts(3) // Reset attempts for next move
        setGameState(prev => {
          if (!prev) return prev
          return {
            ...prev,
            currentMoveIndex: prev.currentMoveIndex + 1,
            correctMoves: prev.correctMoves + 1
          }
        })
        toast.success('Correct move!')
        return true
      } else {
        // Wrong move
        const attemptsLeft = currentAttempts - 1
        setCurrentAttempts(attemptsLeft)
        setGameState(prev => {
          if (!prev) return prev
          return {
            ...prev,
            wrongMoves: prev.wrongMoves + 1
          }
        })

        if (attemptsLeft <= 0) {
          // After 3 failed attempts
          setShowingCorrectMove(true)
          toast.error(`The correct move was: ${expectedMove}`)

          // Make the correct move
          game.move(expectedMove)
          setCurrentPosition(game.fen())

          // Wait a bit then proceed to next move
          setTimeout(() => {
            setShowingCorrectMove(false)
            setCurrentAttempts(3)
            setGameState(prev => {
              if (!prev) return prev
              return {
                ...prev,
                currentMoveIndex: prev.currentMoveIndex + 1
              }
            })
            setIsPlayerTurn(false) // This will trigger computer's move
          }, 500)
        } else {
          toast.error(`Wrong move! ${attemptsLeft} attempts left`)
        }
        return false
      }
    } catch {
      toast.error('Invalid move')
      return false
    }
  }

  function handleReset() {
    setCurrentAttempts(3)
    setShowingCorrectMove(false)
    setGameState(null)
  }

  if (isLoading || !currentPosition) {
    return (
      <div className="w-full aspect-square rounded-xl bg-gray-50 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-2xl">
        <Chessboard
          position={currentPosition}
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation}
          arePiecesDraggable={isPracticeMode && isPlayerTurn && !gameState?.isGameOver}
          customBoardStyle={{
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
        />
      </div>
      {isPracticeMode && gameState && (
        <div className="rounded-xl bg-white/90 backdrop-blur-sm p-6 border border-gray-100 shadow-lg">
          <div className="grid grid-cols-2 gap-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Correct moves', value: gameState.correctMoves, color: 'text-emerald-600' },
                { label: 'Wrong moves', value: gameState.wrongMoves, color: 'text-rose-600' },
                { label: 'Current attempts', value: currentAttempts, color: 'text-blue-600' },
                { label: 'Progress', value: `${gameState.currentMoveIndex} / ${allMoves.length}`, color: 'text-gray-700' }
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-1">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className={`text-lg font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end">
              <Button 
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-md transition-all duration-300"
              >
                {gameState.isGameOver ? 'Start New Training' : 'Reset'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 