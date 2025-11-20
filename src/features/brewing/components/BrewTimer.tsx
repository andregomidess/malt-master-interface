import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlay, BiPause, BiReset } from 'react-icons/bi'

interface BrewTimerProps {
  duration: number // em minutos
  onComplete?: () => void
  onTick?: (remaining: number) => void
}

export function BrewTimer({ duration, onComplete, onTick }: BrewTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false)
      onComplete?.()
    }
  }, [remainingSeconds, isRunning, onComplete])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        const newRemaining = prev - 1
        onTick?.(newRemaining)
        return newRemaining
      })
      setElapsedSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, onTick])

  const handlePlayPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setRemainingSeconds(duration * 60)
    setElapsedSeconds(0)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (elapsedSeconds / (duration * 60)) * 100 : 0

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
        <Text style={styles.timerLabel}>Tempo Restante</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={handlePlayPause}
        >
          {isRunning ? (
            <BiPause size={24} color={COLORS.neutral.white} />
          ) : (
            <BiPlay size={24} color={COLORS.neutral.white} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={handleReset}
        >
          <BiReset size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, progress)}%` },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 16,
  },
  timerDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.brand.primary,
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: COLORS.brand.primary,
  },
  resetButton: {
    backgroundColor: COLORS.neutral.gray[100],
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.neutral.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.brand.primary,
    borderRadius: 4,
  },
})
