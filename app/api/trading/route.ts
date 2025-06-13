import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface TradingResponse {
  success: boolean;
  data?: {
    decision: string;
    agents: {
      position_trader: {
        id: string;
        analysis: any;
      };
      scalper: {
        id: string;
        analysis: any;
      };
      swing_trader: {
        id: string;
        analysis: any;
      };
      day_trader: {
        id: string;
        analysis: any;
      };
    };
  };
  error?: string;
}

export async function POST(req: Request) {
  try {
    const { query, date, mode = 'quick' } = await req.json();

    if (!query || !date) {
      return NextResponse.json({ error: 'Missing query or date' }, { status: 400 });
    }

    const pythonScriptPath = path.resolve(process.cwd(), 'app/TradingAgents/main.py');
    const params = JSON.stringify({ query, date, mode });

    const pythonProcess = spawn('python', [
      pythonScriptPath,
      '--action',
      'analyze',
      '--params',
      params,
    ]);

    let scriptOutput = '';
    let scriptError = '';

    pythonProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      scriptError += data.toString();
    });

    const executionPromise = new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(scriptOutput);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Python script output: ${scriptOutput}`));
          }
        } else {
          reject(new Error(`Python script exited with code ${code}: ${scriptError}`));
        }
      });
    });

    const result = await executionPromise;
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 