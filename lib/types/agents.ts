export interface AgentResponse<T = any> {
  success: boolean
  content: T
  thoughts: string
  error?: string
}

export interface EvaluationResult {
  score: number // 1-10
  critique: string
  isPremium: boolean
  fixSuggestions?: string[]
}

export interface MonitorLog {
  step: string
  agent: string
  status: 'start' | 'success' | 'failure'
  message: string
  timestamp: string
}

export interface GeneratorOutput {
  components: any[]
  metadata?: {
    theme: string
    accentColor: string
  }
}
