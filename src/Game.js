import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import soundFile from './ytmp3free.cc_babylone-zina-official-music-video-youtubemp3free.org.mp3';

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  const moveSoundRef = useRef(new Audio(soundFile));
  const winSoundRef = useRef(new Audio(soundFile));

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board) || isBoardFull(board)) {
      return;
    }

    moveSoundRef.current.play();
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const isBoardFull = (board) => {
    return board.every(cell => cell !== null);
  };

  const minimax = (newBoard, player) => {
    const availableSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

    if (calculateWinner(newBoard) === 'X') {
      return { score: -10 };
    } else if (calculateWinner(newBoard) === 'O') {
      return { score: 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      newBoard[availableSpots[i]] = player;

      if (player === 'O') {
        const result = minimax(newBoard, 'X');
        move.score = result.score;
      } else {
        const result = minimax(newBoard, 'O');
        move.score = result.score;
      }

      newBoard[availableSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const computerMove = (board) => {
    return minimax(board, 'O').index;
  };

  useEffect(() => {
    if (!isXNext && !calculateWinner(board) && !isBoardFull(board)) {
      const timeoutId = setTimeout(() => {
        const computerIndex = computerMove(board);
        if (computerIndex !== undefined) {
          moveSoundRef.current.play();
          const newBoard = board.slice();
          newBoard[computerIndex] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 1000); // Délai de 1 seconde
      return () => clearTimeout(timeoutId); // Nettoyer le timeout si le composant est démonté
    }
  }, [isXNext, board]);

  const winner = calculateWinner(board);
  const isDraw = isBoardFull(board) && !winner;
  
  useEffect(() => {
    if (winner || isDraw) {
      winSoundRef.current.play();
    }
  }, [winner, isDraw]);

  const getStatus = () => {
    if (winner) {
      return winner === 'X' ? 'Félicitations! Vous avez gagné!' : 'Perdu! L\'ordinateur a gagné!';
    } else if (isDraw) {
      return 'Match nul!';
    } else {
      return `Next player: ${isXNext ? 'Homme' : 'Computer'}`;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div>
      <div className="status">{getStatus()}</div>
      <div className="board">
        {board.map((cell, index) => (
          <button key={index} onClick={() => handleClick(index)} className="cell">
            {cell}
          </button>
        ))}
      </div>
      {(winner || isDraw) && (
        <div className="winner-animation">
          {winner === 'X' ? '🎉 Félicitations! 🎉' : winner === 'O' ? '💔 Perdu! 💔' : '😐 Match nul! 😐'}
          <button onClick={resetGame} className="reset-button">Recommencer</button>
        </div>
      )}
    </div>
  );
};

export default Game;


