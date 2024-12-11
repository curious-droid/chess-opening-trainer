'use client'

import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, Square, Piece } from 'chess.js'
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
    } catch (error) {
      toast.error('Invalid PGN format')
      setGameState(null)
    }
  }, [gameState?.pgn, gameState?.playerColor, gameState?.currentMoveIndex])

  // Handle computer moves
  useEffect(() => {
    if (!isPlayerTurn && game && gameState && !gameState.isGameOver) {
      const timer = setTimeout(makeComputerMove, 500)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, game, gameState])

  function makeComputerMove() {
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
    } catch (error) {
      toast.error('Invalid move in PGN')
      setGameState(null)
    }
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
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
    } catch (error) {
      toast.error('Invalid move')
      return false
    }
  }

  function handleGameOver() {
    setGameState(prev => {
      if (!prev) return prev
      return { ...prev, isGameOver: true }
    })
    toast.success('Training complete!')
  }

  function handleReset() {
    setCurrentAttempts(3)
    setShowingCorrectMove(false)
    setGameState(null)
  }

  if (isLoading || !currentPosition) {
    return <div className="w-full pb-[100%] bg-gray-100 animate-pulse" />
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full pb-[100%]">
        <div className="absolute inset-0">
          <Chessboard
            position={currentPosition}
            onPieceDrop={onDrop}
            boardOrientation={boardOrientation}
            arePiecesDraggable={isPracticeMode && isPlayerTurn && !gameState?.isGameOver}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
          />
        </div>
      </div>
      {isPracticeMode && gameState && (
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-x-4">
              <p>Correct moves:</p>
              <p className="font-medium">{gameState.correctMoves}</p>
              <p>Wrong moves:</p>
              <p className="font-medium">{gameState.wrongMoves}</p>
              <p>Current move attempts:</p>
              <p className="font-medium">{currentAttempts}</p>
              <p>Progress:</p>
              <p className="font-medium">{gameState.currentMoveIndex} / {allMoves.length}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleReset}>
              {gameState.isGameOver ? 'Start New Training' : 'Reset'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 