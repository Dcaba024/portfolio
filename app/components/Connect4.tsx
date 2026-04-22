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
    <section id="connect4" className="section-shell px-6 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-panel rounded-[2rem] p-6 text-left md:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <p className="section-kicker">Interactive Demo</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              A playful break in the flow, without breaking the design.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              The Connect 4 section now feels like part of the same portfolio system:
              cleaner spacing, stronger contrast, and clearer status messaging.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/55">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    OpenAI Challenge
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                    Connect 4 arena
                  </p>
                </div>
                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-300">
                  Live
                </span>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-4 shadow-inner dark:bg-slate-900">
                <div className="grid grid-rows-6 gap-2 rounded-[1.25rem] bg-cyan-700/90 p-3">
                  {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-7 gap-2">
                      {row.map((cell, colIndex) => {
                        const isPlayable =
                          winner === EMPTY &&
                          !isThinking &&
                          validColumns.includes(colIndex);
                        const chipColor =
                          cell === USER
                            ? "bg-amber-300"
                            : cell === AI
                              ? "bg-rose-500"
                              : "bg-slate-900";

                        return (
                          <button
                            key={`${rowIndex}-${colIndex}`}
                            type="button"
                            onClick={() => handleMove(colIndex)}
                            disabled={!isPlayable}
                            className={`h-11 w-11 rounded-full border border-white/10 ${chipColor} shadow-sm transition hover:scale-105 sm:h-14 sm:w-14 disabled:cursor-not-allowed disabled:hover:scale-100`}
                            aria-label={`Column ${colIndex + 1}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
                <span>{isBoardFull && winner === EMPTY ? "Board full." : status}</span>
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-full border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:border-slate-400 dark:border-slate-700 dark:text-slate-100"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-950/55">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                How it works
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                You play yellow. OpenAI plays red. The API evaluates the current
                board and returns the next move, so each game is reactive instead
                of hardcoded.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white dark:border-white/10">
              <h3 className="text-lg font-semibold">Pro tip</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Take the center early. It opens more horizontal and diagonal winning
                lines while making the AI defend sooner.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
