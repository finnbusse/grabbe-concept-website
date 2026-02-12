import { execSync } from "child_process"
console.log("Installing geist package...")
execSync("cd /vercel/share/v0-project && pnpm add geist@1.7.0", { stdio: "inherit" })
console.log("Done!")
