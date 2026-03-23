import { MemoryAgent } from './memory'
import { GeneratorAgent } from './generator'
import { EvaluatorAgent } from './evaluator'
import { RefinerAgent } from './refiner'
import { MonitorLog } from '../types/agents'
import dbConnect from '@/lib/mongodb'

export class MonitorAgent {
  private memory = new MemoryAgent()
  private generator = new GeneratorAgent()
  private evaluator = new EvaluatorAgent()
  private refiner = new RefinerAgent()

  async run(prompt: string, userId: string = "system") {
    const thoughts: { agent: string, content: string }[] = []
    const logs: MonitorLog[] = []

    const addLog = (agent: string, step: string, message: string, status: 'start' | 'success' | 'failure' = 'success') => {
      const log = { step, agent, status, message, timestamp: new Date().toISOString() }
      logs.push(log)
      console.log(`[${agent}] ${step}: ${message}`)
    }

    try {
      await dbConnect()
      
      // Step 1: Memory
      addLog("MemoryAgent", "Retrieve", "Fetching previous context...", "start")
      const memoryRes = await this.memory.getContext(userId)
      addLog("MemoryAgent", "Retrieve", memoryRes.thoughts)
      thoughts.push({ agent: "MemoryAgent", content: memoryRes.thoughts })

      // Step 2: Generation
      addLog("GeneratorAgent", "Generate", "Creating premium layout draft...", "start")
      const genRes = await this.generator.generate(prompt, memoryRes.content)
      if (!genRes.success) throw new Error(genRes.error)
      addLog("GeneratorAgent", "Generate", "Layout draft created.")
      thoughts.push({ agent: "GeneratorAgent", content: "Created first draft of components." })

      // Step 3: Evaluation
      addLog("EvaluatorAgent", "Evaluate", "Reviewing layout quality...", "start")
      const evalRes = await this.evaluator.evaluate(genRes.content, prompt)
      if (!evalRes.success) throw new Error(evalRes.error)
      addLog("EvaluatorAgent", "Evaluate", `Score: ${evalRes.content.score}/10. ${evalRes.content.critique}`)
      thoughts.push({ agent: "EvaluatorAgent", content: `Evaluated draft. Score: ${evalRes.content.score}. Critique: ${evalRes.content.critique}` })

      let finalOutput = genRes.content

      // Step 4: Refinement (only if score < 8)
      if (evalRes.content.score < 8) {
        addLog("RefinerAgent", "Refine", "Applying fixes to improve quality...", "start")
        const refineRes = await this.refiner.refine(genRes.content, prompt, evalRes.content)
        if (refineRes.success) {
          finalOutput = refineRes.content
          addLog("RefinerAgent", "Refine", "Layout polished and finalized.")
          thoughts.push({ agent: "RefinerAgent", content: "Polished the layout based on evaluator feedback." })
        } else {
          addLog("RefinerAgent", "Refine", "Refinement failed, using original draft.", "failure")
        }
      } else {
        addLog("MonitorAgent", "Finalize", "Draft quality is sufficient. Skipping refinement.")
      }

      // Step 5: Save to Memory
      await this.memory.save(userId, prompt, finalOutput, thoughts)
      addLog("MonitorAgent", "Done", "Pipeline complete. Output saved to memory.")

      return {
        success: true,
        components: finalOutput.components,
        thoughts,
        logs
      }

    } catch (e: any) {
      addLog("MonitorAgent", "Main", `Fatal error: ${e.message}`, "failure")
      return {
        success: false,
        error: e.message,
        logs
      }
    }
  }
}
