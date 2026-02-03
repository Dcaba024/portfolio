"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const USER = 1;
const AI = 2;

const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

const getValidColumns = (board: number[][]) =>
  board[0].map((cell, col) => (cell === EMPTY ? col : -1)).filter((c) => c >= 0);

const dropInColumn = (board: number[][], col: number, player: number) => {
  const next = board.map((row) => row.slice());
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (next[row][col] === EMPTY) {
      next[row][col] = player;
      return { board: next, row };
    }
  }
  return { board, row: -1 };
};

const checkWinner = (board: number[][]) => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cell = board[row][col];
      if (cell === EMPTY) continue;
      for (const [dr, dc] of directions) {
        let count = 1;
        let r = row + dr;
        let c = col + dc;
        while (
          r >= 0 &&
          r < ROWS &&
          c >= 0 &&
          c < COLS &&
          board[r][c] === cell
        ) {
          count += 1;
          if (count === 4) return cell;
          r += dr;
          c += dc;
        }
      }
    }
  }
  return EMPTY;
};

export default function Connect4() {
  const [board, setBoard] = useState<number[][]>(() => createBoard());
  const [isThinking, setIsThinking] = useState(false);
  const [winner, setWinner] = useState<number>(EMPTY);
  const [status, setStatus] = useState("Your move.");

  const validColumns = useMemo(() => getValidColumns(board), [board]);
  const isBoardFull = validColumns.length === 0;

  const resetGame = () => {
    setBoard(createBoard());
    setIsThinking(false);
    setWinner(EMPTY);
    setStatus("Your move.");
  };

  const requestAiMove = async (nextBoard: number[][]) => {
    setIsThinking(true);
    setStatus("OpenAI is thinking...");
    try {
      const response = await fetch("/api/connect4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: nextBoard }),
      });

      const data = (await response.json()) as { column?: number; error?: string };

      if (!response.ok || typeof data.column !== "number") {
        throw new Error(data.error ?? "Unable to get AI move.");
      }

      return data.column;
    } finally {
      setIsThinking(false);
    }
  };

  const handleMove = async (col: number) => {
    if (winner !== EMPTY || isThinking) return;
    if (!validColumns.includes(col)) return;

    const { board: nextBoard } = dropInColumn(board, col, USER);
    const userWinner = checkWinner(nextBoard);
    setBoard(nextBoard);

    if (userWinner === USER) {
      setWinner(USER);
      setStatus("You win! Nice connect 4.");
      return;
    }

    if (getValidColumns(nextBoard).length === 0) {
      setStatus("Draw game. Want to run it back?");
      return;
    }

    let aiColumn: number;
    try {
      aiColumn = await requestAiMove(nextBoard);
    } catch (error) {
      console.error("Connect 4 AI move failed:", error);
      setStatus("AI move failed. Please reset and try again.");
      return;
    }

    const safeColumn = getValidColumns(nextBoard).includes(aiColumn)
      ? aiColumn
      : getValidColumns(nextBoard)[0];

    const { board: aiBoard } = dropInColumn(nextBoard, safeColumn, AI);
    const aiWinner = checkWinner(aiBoard);
    setBoard(aiBoard);

    if (aiWinner === AI) {
      setWinner(AI);
      setStatus("OpenAI wins. Try a different opener.");
      return;
    }

    if (getValidColumns(aiBoard).length === 0) {
      setStatus("Draw game. Want to run it back?");
      return;
    }

    setStatus("Your move.");
  };

  return (
    <section
      id="connect4"
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl w-full"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-blue-500">Connect 4</h2>
          <p className="text-gray-300 mt-3">
            Challenge a Connect 4 engine powered by OpenAI. Drop a chip and see
            if you can beat the model.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-10 items-center">
          <div className="bg-[#0f111a] border border-blue-900/40 rounded-2xl p-6 shadow-2xl shadow-blue-900/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-400">
                  OpenAI Challenge
                </p>
                <p className="text-xl font-semibold">Connect 4 Arena</p>
              </div>
              <span className="text-xs px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full border border-blue-600/40">
                Live
              </span>
            </div>

            <div className="grid grid-rows-6 gap-2 bg-black/30 rounded-xl p-4 border border-white/5">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-2">
                  {row.map((cell, colIndex) => {
                    const isPlayable =
                      winner === EMPTY &&
                      !isThinking &&
                      validColumns.includes(colIndex);
                    const chipColor =
                      cell === USER
                        ? "bg-blue-500"
                        : cell === AI
                          ? "bg-red-500"
                          : "bg-slate-800";

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        type="button"
                        onClick={() => handleMove(colIndex)}
                        disabled={!isPlayable}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${chipColor} border border-white/10 transition-all hover:scale-105 disabled:cursor-not-allowed`}
                        aria-label={`Column ${colIndex + 1}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
              <span>{isBoardFull && winner === EMPTY ? "Board full." : status}</span>
              <button
                type="button"
                onClick={resetGame}
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">How it works</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                You play blue. OpenAI plays red. The API evaluates the board and
                picks its next move, so you are always facing a fresh response
                from the model.
              </p>
            </div>
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Pro tip</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Control the center early to reduce OpenAI's winning lines. But
                watch for diagonal traps.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
