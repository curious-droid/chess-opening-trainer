declare module 'chess.js' {
  export type Color = 'w' | 'b'
  export type Square = 'a8' | 'b8' | /* ... */ 'g1' | 'h1'
  export type Piece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

  export interface ChessMove {
    color: Color
    from: Square
    to: Square
    promotion?: Piece
    piece: Piece
    san: string
  }

  export class Chess {
    constructor(fen?: string)
    loadPgn(pgn: string): boolean
    fen(): string
    move(move: string | { from: string; to: string; promotion?: string }): ChessMove
    moves(options?: { verbose?: boolean }): string[] | ChessMove[]
    history(options?: { verbose?: boolean }): string[] | ChessMove[]
    undo(): ChessMove | null
  }
} 