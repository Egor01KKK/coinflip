"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { decodeEventLog } from "viem";
import { coinFlipContract, COINFLIP_ABI } from "@/lib/contract";

export type FlipResult = {
  won: boolean;
  wasHeads: boolean;
  guessedHeads: boolean;
  currentStreak: number;
  maxStreak: number;
};

export function useFlip() {
  const [lastResult, setLastResult] = useState<FlipResult | null>(null);
  const publicClient = usePublicClient();

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Parse result from transaction receipt
  const parseResultFromReceipt = useCallback(async () => {
    if (!receipt || !publicClient) return null;

    try {
      // Find FlipResult event in logs
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: COINFLIP_ABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "FlipResult") {
            const args = decoded.args as {
              player: string;
              guessedHeads: boolean;
              wasHeads: boolean;
              won: boolean;
              currentStreak: bigint;
              maxStreak: bigint;
            };

            return {
              won: args.won,
              wasHeads: args.wasHeads,
              guessedHeads: args.guessedHeads,
              currentStreak: Number(args.currentStreak),
              maxStreak: Number(args.maxStreak),
            };
          }
        } catch {
          // Not our event, continue
        }
      }
    } catch (error) {
      console.error("Error parsing receipt:", error);
    }

    return null;
  }, [receipt, publicClient]);

  const flip = useCallback(
    async (guessHeads: boolean) => {
      setLastResult(null);

      try {
        writeContract({
          ...coinFlipContract,
          functionName: "flip",
          args: [guessHeads],
        });
      } catch (error) {
        console.error("Flip error:", error);
      }
    },
    [writeContract]
  );

  // Process result when confirmed
  const processResult = useCallback(async () => {
    if (isConfirmed && receipt) {
      const result = await parseResultFromReceipt();
      if (result) {
        setLastResult(result);
        return result;
      }
    }
    return null;
  }, [isConfirmed, receipt, parseResultFromReceipt]);

  const resetFlip = useCallback(() => {
    reset();
    setLastResult(null);
  }, [reset]);

  return {
    flip,
    isFlipping: isWritePending || isConfirming,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    lastResult,
    processResult,
    resetFlip,
    error: writeError,
    hash,
  };
}
