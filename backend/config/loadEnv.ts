import dotenv from "dotenv";
import fs from "fs";
import path from "path";

/**
 * Find backend/.env when the process is started from source or from dist/.
 * Walks up a few directories from the calling file and stops at the first .env.
 */
export const resolveEnvPath = (startDir: string): string => {
  let dir = startDir;

  for (let i = 0; i < 4; i += 1) {
    const candidate = path.join(dir, ".env");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return path.join(startDir, ".env");
};

export const loadEnv = (startDir: string) => dotenv.config({ path: resolveEnvPath(startDir) });
