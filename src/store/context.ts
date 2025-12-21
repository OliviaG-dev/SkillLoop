import { createContext } from 'react';
import type { SkillLoopContextValue } from './SkillLoopStore';

export const SkillLoopContext = createContext<SkillLoopContextValue | null>(null);

