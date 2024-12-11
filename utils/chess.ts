import { Chess, ChessMove } from 'chess.js'

export function parsePgn(pgn: string): Chess {
  const chess = new Chess()
  try {
    chess.loadPgn(pgn)
    return chess
  } catch (error) {
    throw new Error('Invalid PGN format')
  }
}

export function validateMove(game: Chess, move: string, expectedMove: string): boolean {
  const tempGame = new Chess(game.fen())
  try {
    tempGame.move(move)
    const lastMove = tempGame.history({ verbose: true }).pop() as ChessMove
    const expectedMoveObj = game.move(expectedMove)
    game.undo()
    
    return lastMove.from === expectedMoveObj.from && 
           lastMove.to === expectedMoveObj.to &&
           lastMove.promotion === expectedMoveObj.promotion
  } catch {
    return false
  }
} 