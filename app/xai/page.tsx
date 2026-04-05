import { Suspense } from "react"
import XaiClient from "./xai-client"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading XAI predictions…
        </div>
      }
    >
      <XaiClient />
    </Suspense>
  )
}
