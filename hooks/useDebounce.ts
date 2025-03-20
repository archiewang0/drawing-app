import { useCallback, useRef } from 'react'

export function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
) {
    const timerRef = useRef<NodeJS.Timeout| null>(null)

    return useCallback((...args: Parameters<T>) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
            callback(...args)
        }, delay)
    }, [callback, delay])
}