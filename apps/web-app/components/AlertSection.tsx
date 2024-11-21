import React, { ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface IAlertSectionProps {
  title?: ReactNode
  children: ReactNode
}

export const AlertSection = ({ title, children }: IAlertSectionProps) => {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.contentContainer}>
        <View style={styles.childrenContainer}>{children}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: '92%', // Approximate equivalent of calc(100vh-8rem)
    marginTop: 16, // equivalent to mt-4
  },
  title: {
    marginBottom: 4, // equivalent to mb-1
    fontSize: 18, // equivalent to text-lg
    fontWeight: '600', // equivalent to font-semibold
  },
  contentContainer: {
    height: 256, // equivalent to h-64
    backgroundColor: 'white',
  },
  childrenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16, // equivalent to gap-4
    fontWeight: '300', // equivalent to font-light
  },
})
