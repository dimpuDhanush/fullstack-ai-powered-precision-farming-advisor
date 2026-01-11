import React, { createContext, useContext, useMemo, useState } from "react";

export type SelectedAnalysis = {
  analysisId: string;
  imageUrl?: string;
  mlLabel?: string;
  createdAt?: string;
  cropType?: string | null;
};

type Ctx = {
  selected: SelectedAnalysis | null;
  setSelected: (a: SelectedAnalysis | null) => void;
};

const AnalysisContext = createContext<Ctx | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<SelectedAnalysis | null>(null);

  const value = useMemo(() => ({ selected, setSelected }), [selected]);
  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisSelection() {
  const ctx = useContext(AnalysisContext);
  if (!ctx)
    throw new Error(
      "useAnalysisSelection must be used within AnalysisProvider"
    );
  return ctx;
}
