import React from 'react'
import { Text as RNText, TextProps } from 'react-native'
import { HEADING_STYLES, TEXT_STYLES } from '../styles/typography'

interface HeadingProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
}

interface TextBodyProps extends TextProps {
  variant?: 'body' | 'bodyLarge' | 'bodySmall' | 'label' | 'button' | 'caption'
  children: React.ReactNode
}

export const Heading: React.FC<HeadingProps> = ({
  variant = 'h1',
  style,
  children,
  ...props
}) => {
  return (
    <RNText style={[HEADING_STYLES[variant], style]} {...props}>
      {children}
    </RNText>
  )
}

export const Text: React.FC<TextBodyProps> = ({
  variant = 'body',
  style,
  children,
  ...props
}) => {
  return (
    <RNText style={[TEXT_STYLES[variant], style]} {...props}>
      {children}
    </RNText>
  )
}
