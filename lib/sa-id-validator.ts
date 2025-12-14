/**
 * South African ID Number Validation & Parsing Utility
 * Format: YYMMDD SSSS C A Z
 *
 * YYMMDD = Date of Birth (6 digits)
 * SSSS = Gender (0000-4999 = Female, 5000-9999 = Male)
 * C = Citizenship (0 = SA Citizen, 1 = Permanent Resident)
 * A = Usually 8 or 9
 * Z = Checksum digit
 */

export interface SAIDInfo {
  isValid: boolean
  dateOfBirth: string | null
  age: number | null
  gender: "Male" | "Female" | null
  citizenship: "SA Citizen" | "Permanent Resident" | null
  errors: string[]
}

export function validateSAIDNumber(idNumber: string): SAIDInfo {
  const result: SAIDInfo = {
    isValid: false,
    dateOfBirth: null,
    age: null,
    gender: null,
    citizenship: null,
    errors: [],
  }

  // Remove spaces and validate format
  const cleanId = idNumber.replace(/\s/g, "")

  if (cleanId.length !== 13) {
    result.errors.push("ID number must be 13 digits")
    return result
  }

  if (!/^\d{13}$/.test(cleanId)) {
    result.errors.push("ID number must contain only digits")
    return result
  }

  // Extract components
  const yearPrefix = cleanId.substring(0, 2)
  const month = cleanId.substring(2, 4)
  const day = cleanId.substring(4, 6)
  const genderCode = Number.parseInt(cleanId.substring(6, 10))
  const citizenshipCode = cleanId.substring(10, 11)

  // Validate and parse date of birth
  const currentYear = new Date().getFullYear()
  const currentCentury = Math.floor(currentYear / 100) * 100
  const lastCentury = currentCentury - 100

  // Determine century (assume people are not over 100 years old)
  let fullYear = lastCentury + Number.parseInt(yearPrefix)
  if (fullYear > currentYear) {
    fullYear = lastCentury + Number.parseInt(yearPrefix)
  } else if (currentYear - fullYear > 100) {
    fullYear = currentCentury + Number.parseInt(yearPrefix)
  }

  const monthNum = Number.parseInt(month)
  const dayNum = Number.parseInt(day)

  // Validate month
  if (monthNum < 1 || monthNum > 12) {
    result.errors.push("Invalid month in ID number")
  }

  // Validate day
  if (dayNum < 1 || dayNum > 31) {
    result.errors.push("Invalid day in ID number")
  }

  // Parse date
  if (result.errors.length === 0) {
    const dobDate = new Date(fullYear, monthNum - 1, dayNum)
    result.dateOfBirth = `${fullYear}-${month}-${day}`

    // Calculate age
    const today = new Date()
    let age = today.getFullYear() - fullYear
    const monthDiff = today.getMonth() - (monthNum - 1)
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dayNum)) {
      age--
    }
    result.age = age
  }

  // Extract gender
  if (genderCode >= 0 && genderCode <= 4999) {
    result.gender = "Female"
  } else if (genderCode >= 5000 && genderCode <= 9999) {
    result.gender = "Male"
  } else {
    result.errors.push("Invalid gender code")
  }

  // Extract citizenship
  if (citizenshipCode === "0") {
    result.citizenship = "SA Citizen"
  } else if (citizenshipCode === "1") {
    result.citizenship = "Permanent Resident"
  } else {
    result.errors.push("Invalid citizenship code")
  }

  // Validate checksum (Luhn algorithm)
  if (!validateLuhnChecksum(cleanId)) {
    result.errors.push("Invalid checksum - ID number may be fake")
  }

  // Set validity
  result.isValid = result.errors.length === 0

  return result
}

function validateLuhnChecksum(idNumber: string): boolean {
  let sum = 0
  let isDouble = false

  // Process from right to left, excluding the last digit (checksum)
  for (let i = idNumber.length - 2; i >= 0; i--) {
    let digit = Number.parseInt(idNumber[i])

    if (isDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isDouble = !isDouble
  }

  const checksum = (10 - (sum % 10)) % 10
  return checksum === Number.parseInt(idNumber[idNumber.length - 1])
}

export function compareMismatch(
  idInfo: SAIDInfo,
  profileGender: string,
  profileDOB: string,
): {
  hasGenderMismatch: boolean
  hasDOBMismatch: boolean
  issues: string[]
} {
  const issues: string[] = []
  let hasGenderMismatch = false
  let hasDOBMismatch = false

  // Compare gender
  if (idInfo.gender && profileGender) {
    const normalizedProfileGender = profileGender.toLowerCase()
    const normalizedIdGender = idInfo.gender.toLowerCase()

    if (normalizedProfileGender !== normalizedIdGender) {
      hasGenderMismatch = true
      issues.push(`Gender mismatch: ID shows ${idInfo.gender}, profile shows ${profileGender}`)
    }
  }

  // Compare date of birth
  if (idInfo.dateOfBirth && profileDOB) {
    const normalizedProfileDOB = profileDOB.replace(/\//g, "-")
    const normalizedIdDOB = idInfo.dateOfBirth

    if (normalizedProfileDOB !== normalizedIdDOB) {
      hasDOBMismatch = true
      issues.push(`Date of birth mismatch: ID shows ${idInfo.dateOfBirth}, profile shows ${profileDOB}`)
    }
  }

  return {
    hasGenderMismatch,
    hasDOBMismatch,
    issues,
  }
}
