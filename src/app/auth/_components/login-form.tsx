'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'

type OAuthProvider = 'github' | 'google' | 'discord'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)

  const handleSocialLogin = async (provider: OAuthProvider) => {
    const supabase = createClient()
    setIsLoading(true)
    setLoadingProvider(provider)
    setError(null)

    try {
      // Changez '/protected' par la page de votre choix (ex: '/dashboard', '/home', '/profile')
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {error && <p className="text-sm text-destructive-500">{error}</p>}
            
            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={() => handleSocialLogin('google')}
            >
              {loadingProvider === 'google' ? 'Logging in...' : 'Continue with Google'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => handleSocialLogin('discord')}
            >
              {loadingProvider === 'discord' ? 'Logging in...' : 'Continue with Discord'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => handleSocialLogin('github')}
            >
              {loadingProvider === 'github' ? 'Logging in...' : 'Continue with GitHub'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
