# Chess Opening Trainer

A web-based application built with Next.js that helps chess players practice and master their opening repertoire.

## Features

- Interactive chess board with drag-and-drop piece movement
- PGN (Portable Game Notation) upload support
- Practice mode with move validation
- Color selection (play as White or Black)
- Progress tracking (correct/wrong moves)
- Three attempts per move before showing the correct continuation
- Responsive design for various screen sizes
- Error handling and user feedback via toast notifications

## Tech Stack

- **Framework**: Next.js 15.1
- **UI Components**: 
  - Custom components built with Radix UI
  - Tailwind CSS for styling
  - Shadcn UI component system
- **Chess Logic**: 
  - chess.js for game mechanics
  - react-chessboard for the interactive board
- **Form Handling**: 
  - React Hook Form
  - Zod for validation
- **Type Safety**: TypeScript

## How It Works

1. Users can upload or paste a PGN file containing the chess opening they want to practice
2. They select which color they want to play as (White or Black)
3. The application validates moves against the expected continuation:
   - Users get 3 attempts for each move
   - Correct moves are rewarded with success messages
   - Wrong moves reduce the remaining attempts
   - After 3 failed attempts, the correct move is shown
4. Progress tracking shows:
   - Number of correct moves
   - Number of wrong moves
   - Current position in the opening
   - Remaining attempts for the current move

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Next.js app router components and layouts
- `/components`: Reusable React components including:
  - Chess board and game container
  - PGN upload form
  - UI components (buttons, forms, etc.)
- `/types`: TypeScript type definitions
- `/utils`: Helper functions for chess logic
- `/lib`: Utility functions and shared code

## Key Components

1. **GameContainer**: Main component orchestrating the game state and logic
2. **ChessBoard**: Handles the interactive chess board and move validation
3. **PgnUploadForm**: Manages PGN input and color selection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the MIT license.
