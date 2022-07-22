import {App} from 'aws-cdk-lib'

/**
 * Bunch of misc utility functions to help build CDK stacks
 */
export class StackUtils {
  /** Returns a string with the first letter uppercase */
  static firstLetterUpperCase(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
  }

  /**
   * Reads a prop from cdk context, if not found in context, falls back to environment variable.
   * Throws if not found
   * @notes
   * This method relies on having a STAGES object in your context, and a STAGE value in your context or environment variable.
   * Example:
   *
   * env variable to indicate which stage we want to pull prop from context
   * STAGE=prod
   *
   * cdk.json
   * {
   *   "context": {
   *     "STAGES": {
   *       "staging": {
   *         "AWS_ACCOUNT_ID": "staging-account-id"
   *       },
   *       "prod": {
   *         "AWS_ACCOUNT_ID": "prod-account-id"
   *       }
   *     }
   *   }
   */
  static readPropFromContext(app: App, propName: string): string {
    const value = this._readPropFromContext(app, propName)
    if (!value) {
      throw new Error(`Missing Prop Error: ${propName} not found. Did you set it ?`)
    }
    return value
  }

  /**
   * Same as readPropFromContext, but won't throw if prop is not found
   */
  static readOptionalPropFromContext(app: App, propName: string): string | undefined {
    const value = this._readPropFromContext(app, propName)
    if (!value) {
      console.warn(`Could not find prop ${propName}.`)
      return undefined
    }
    return value
  }

  private static _readPropFromContext(app: App, propName: string): string | undefined {
    const stages = app.node.tryGetContext('STAGES')
    const stage = app.node.tryGetContext('STAGE') || process.env['STAGE']

    let propValue: string | undefined = app.node.tryGetContext(propName)
    if (!propValue && stage in stages) {
      // try find the predefined prop from the current stage in cdk.json
      propValue = stages[stage][propName]
    }
    if (!propValue) {
      // try find prop in environment variables
      propValue = process.env[propName]
    }

    return propValue
  }

  /**
   * Try to parse an integer from a string, throws if not possible
   */
  static parseInteger(value: string | undefined): number | undefined {
    if (!value) {
      return undefined
    }
    const num = parseInt(value)
    if (!Number.isFinite(num)) {
      throw new Error(`Invalid integer value: ${value}`)
    }
    return num
  }

  /**
   * Parses a string list of CORS allowed origins that are space separated and returns an array
   * Falls back to parameter "fallback" if list is empty
   */
  static parseCorsAllowedOrigins(apiCorsAllowedOriginValue: string | undefined, fallback: string[]): string[] {
    if (apiCorsAllowedOriginValue) {
      const origins = apiCorsAllowedOriginValue.split(' ')
      if (origins.length > 0) {
        return origins
      }
    }
    return fallback
  }
}
