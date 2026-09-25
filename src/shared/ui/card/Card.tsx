import type {
  HTMLAttributes,
  ReactNode,
} from 'react'

import { cn } from '@/shared/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-border px-5 py-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn(
        'p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'border-t border-border px-5 py-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
}