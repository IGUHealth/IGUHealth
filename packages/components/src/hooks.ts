import { useState } from "react"

export const useTemporaryError = (): [boolean, () => void] => {
  const [err, setErr] = useState(false)

  const flashTemporaryError = () => {
    setErr(true)
    setTimeout(() => {
      setErr(false)
    }, 1000)
  }

  return [err, flashTemporaryError]
}
