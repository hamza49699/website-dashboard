export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-03'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skknR3jZcTJYma4jBdwe4ozcHUIrni3mZrfneq8EacitMHYSKNJRtIMtgIRXlgkxj9LPGOsbPWHf1igjszIZxMNFmxPOsOdk6OhG3p4FdVHqcMfxeK46dV1KUtYActlAnZenN1zPwb1UikoAPs1wLy7dT2eNARmnyB4d8ziKt6ZgNyVsdDBm",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
