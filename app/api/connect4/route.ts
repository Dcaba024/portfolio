import { NextResponse } from "next/server";

type Connect4Payload = {
  board?: number[][];
};

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const USER = 1;
const AI = 2;

const systemPrompt = `
You are an expert Connect 4 player. You are playing as the red tokens.
Board encoding: 0 = empty, 1 = human player (blue), 2 = AI player (red).
Return a single integer for the column index, and nothing else.
Always choose from the provided validColumns list.
`.trim();

const getValidColumns = (board: number[][]) =>
  board[0].map((cell, col) => (cell === EMPTY ? col : -1)).filter((c) => c >= 0);

const isValidBoard = (board: number[][]) => {
  if (!Array.isArray(board) || board.length !== ROWS) return false;
  return board.every(
    (row) =>
      Array.isArray(row) &&
      row.length === COLS &&
      row.every((cell) => cell === EMPTY || cell === USER || cell === AI)
  );
};

const dropInColumn = (board: number[][], col: number, player: number) => {
  const next = board.map((row) => row.slice());
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (next[row][col] === EMPTY) {
      next[row][col] = player;
      return next;
    }
  }
  return next;
};

const checkWinner = (board: number[][], player: number) => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (board[row][col] !== player) continue;
      for (const [dr, dc] of directions) {
        let count = 1;
        let r = row + dr;
        let c = col + dc;
        while (
          r >= 0 &&
          r < ROWS &&
          c >= 0 &&
          c < COLS &&
          board[r][c] === player
        ) {
          count += 1;
          if (count === 4) return true;
          r += dr;
          c += dc;
        }
      }
    }
  }
  return false;
};

const scoreWindow = (window: number[], player: number) => {
  const opponent = player === AI ? USER : AI;
  const playerCount = window.filter((cell) => cell === player).length;
  const opponentCount = window.filter((cell) => cell === opponent).length;
  const emptyCount = window.filter((cell) => cell === EMPTY).length;

  if (playerCount === 4) return 100;
  if (playerCount === 3 && emptyCount === 1) return 5;
  if (playerCount === 2 && emptyCount === 2) return 2;
  if (opponentCount === 3 && emptyCount === 1) return -6;
  if (opponentCount === 4) return -100;
  return 0;
};

const scorePosition = (board: number[][], player: number) => {
  let score = 0;

  const centerCol = Math.floor(COLS / 2);
  const centerArray = board.map((row) => row[centerCol]);
  const centerCount = centerArray.filter((cell) => cell === player).length;
  score += centerCount * 3;

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS - 3; col += 1) {
      const window = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
      ];
      score += scoreWindow(window, player);
    }
  }

  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row < ROWS - 3; row += 1) {
      const window = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += scoreWindow(window, player);
    }
  }

  for (let row = 0; row < ROWS - 3; row += 1) {
    for (let col = 0; col < COLS - 3; col += 1) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += scoreWindow(window, player);
    }
  }

  for (let row = 3; row < ROWS; row += 1) {
    for (let col = 0; col < COLS - 3; col += 1) {
      const window = [
        board[row][col],
        board[row - 1][col + 1],
        board[row - 2][col + 2],
        board[row - 3][col + 3],
      ];
      score += scoreWindow(window, player);
    }
  }

  return score;
};

const isTerminal = (board: number[][], validColumns: number[]) =>
  checkWinner(board, USER) || checkWinner(board, AI) || validColumns.length === 0;

const minimax = (
  board: number[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean
): { column: number | null; score: number } => {
  const validColumns = getValidColumns(board);
  const terminal = isTerminal(board, validColumns);

  if (depth === 0 || terminal) {
    if (terminal) {
      if (checkWinner(board, AI)) return { column: null, score: 1_000_000 };
      if (checkWinner(board, USER)) return { column: null, score: -1_000_000 };
      return { column: null, score: 0 };
    }
    return { column: null, score: scorePosition(board, AI) };
  }

  if (maximizing) {
    let value = -Infinity;
    let bestColumn = validColumns[0] ?? null;
    for (const col of validColumns) {
      const next = dropInColumn(board, col, AI);
      const result = minimax(next, depth - 1, alpha, beta, false);
      if (result.score > value) {
        value = result.score;
        bestColumn = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { column: bestColumn, score: value };
  }

  let value = Infinity;
  let bestColumn = validColumns[0] ?? null;
  for (const col of validColumns) {
    const next = dropInColumn(board, col, USER);
    const result = minimax(next, depth - 1, alpha, beta, true);
    if (result.score < value) {
      value = result.score;
      bestColumn = col;
    }
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return { column: bestColumn, score: value };
};

const scoreAiMove = (board: number[][], col: number) => {
  const next = dropInColumn(board, col, AI);
  if (checkWinner(next, AI)) return 1_000_000;
  return scorePosition(next, AI);
};

const pickHeuristicMove = (board: number[][], validColumns: number[]) => {
  for (const col of validColumns) {
    const next = dropInColumn(board, col, AI);
    if (checkWinner(next, AI)) return col;
  }
  for (const col of validColumns) {
    const next = dropInColumn(board, col, USER);
    if (checkWinner(next, USER)) return col;
  }
  const center = Math.floor(COLS / 2);
  if (validColumns.includes(center)) return center;
  return validColumns[0];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Connect4Payload | null;
    const board = body?.board;

    if (!board || !isValidBoard(board)) {
      return NextResponse.json(
        { error: "Invalid board state." },
        { status: 400 }
      );
    }

    const validColumns = getValidColumns(board);
    if (validColumns.length === 0) {
      return NextResponse.json({ error: "Board is full." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({ board, validColumns }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      console.error("OpenAI API error:", errorPayload ?? response.statusText);
      return NextResponse.json(
        { error: "Unable to fetch an AI move right now." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim();
    const column = Number.parseInt(raw, 10);
    const minimaxResult = minimax(board, 4, -Infinity, Infinity, true);
    const minimaxColumn =
      minimaxResult.column !== null &&
      validColumns.includes(minimaxResult.column)
        ? minimaxResult.column
        : validColumns[0];

    if (!Number.isInteger(column) || !validColumns.includes(column)) {
      const fallback = minimaxColumn ?? pickHeuristicMove(board, validColumns);
      return NextResponse.json({ column: fallback });
    }

    const aiScore = scoreAiMove(board, column);
    const minimaxScore = minimaxResult.score;
    const bestColumn =
      minimaxScore > aiScore && minimaxColumn !== null ? minimaxColumn : column;

    return NextResponse.json({ column: bestColumn });
  } catch (error) {
    console.error("Connect4 route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
