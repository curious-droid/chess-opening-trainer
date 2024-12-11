import { Color } from 'chess.js'

export interface ChessMove {
  from: string
  to: string
  promotion?: string
}

export interface GameState {
  pgn: string
  playerColor: Color
  currentMoveIndex: number
  correctMoves: number
  wrongMoves: number
  attemptsLeft: number
  isGameOver: boolean
}

export interface UploadFormData {
  pgn: string
  playerColor: Color
} 