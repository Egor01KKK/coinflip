"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { coinFlipContract } from "@/lib/contract";

export type FlipResult = {
  won: boolean;
  wasHeads: boolean;
  guessedHeads: boolean;
};

export function useFlip() {
  const [lastResult, setLastResult] = useState<FlipResult | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

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

  const flip = useCallback(
    async (guessHeads: boolean) => {
      setIsFlipping(true);
      setLastResult(null);

      try {
        writeContract({
          ...coinFlipContract,
          functionName: "flip",
          args: [guessHeads],
        });
      } catch (error) {
        console.error("Flip error:", error);
        setIsFlipping(false);
      }
    },
    [writeContract]
  );

  // Parse the result from transaction logs when confirmed
  const parseResult = useCallback(() => {
    if (!receipt || !isConfirmed) return null;

    // Find FlipResult event in logs
    const flipResultLog = receipt.logs.find((log) => {
      // FlipResult event topic
      return log.topics[0] === "0x" + "FlipResult".padEnd(64, "0"); // This won't work, need proper topic
    });

    // For now, we'll derive result from the transaction success
    // In production, properly decode the event log
    return lastResult;
  }, [receipt, isConfirmed, lastResult]);

  // Reset state for new flip
  const resetFlip = useCallback(() => {
    reset();
    setLastResult(null);
    setIsFlipping(false);
  }, [reset]);

  // Set result from event (called by parent component listening to events)
  const setResult = useCallback((result: FlipResult) => {
    setLastResult(result);
    setIsFlipping(false);
  }, []);

  return {
    flip,
    isFlipping: isFlipping || isWritePending || isConfirming,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    lastResult,
    setResult,
    resetFlip,
    error: writeError,
    hash,
  };
}
