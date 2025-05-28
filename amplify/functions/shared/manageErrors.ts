/**
 * Processing an caught error and launch a new formatted error
 * corresponding to be returned as GraphQL error.
 *
 * @param {Error} error Original error caught.
 * @param {string} [contextInfo='Operation failed'] Context info optional (i.e: 'updating user', 'creating user').
 * @throws {Error} Launches a new error with a customer-friendly message.
 */
export const handleLambdaError = (
  error: Error,
  contextInfo = 'Operation failed',
): never => {
  // IMPORTANT! Log the COMPLETE original error for internal debugging.
  console.error(`[${contextInfo}] Original Error:`, error);

  let clientMessage = `An unexpected error occurred during: ${contextInfo}.`; // Default message
  //Identify specific errors by their 'name' (common in AWS SDK v3)
  //or sometimes by the message if needed.
  switch (error.name) {
    // --- Common Cognito Errors ---
    case 'UserNotFoundException':
      clientMessage = `User not found. Please check the provided identifier.`;
      break;
    case 'UsernameExistsException':
      clientMessage = `Cannot complete operation: Username or alias (like email/phone) already exists.`;
      break;
    case 'AliasExistsException':
      clientMessage = `Cannot complete operation: Email or phone number is already associated with another user.`;
      break;
    case 'InvalidPasswordException':
      clientMessage = `Invalid password provided or password does not meet policy requirements.`;
      break;
    case 'CodeMismatchException':
      clientMessage = `Invalid verification code provided.`;
      break;
    case 'LimitExceededException':
      clientMessage = `Attempt limit exceeded, please try again later.`;
      break;
    case 'NotAuthorizedException':
      // This error may contain sensitive information about the user or the operation.
      // Decide whether to give a specific or generic message.
      // clientMessage = `Not authorized to perform this operation.`; // More specific
      clientMessage = `Authorization failed. Please check your credentials or permissions.`; // More generic/safe
      break;
    case 'InvalidParameterException':
      // Sensitive information may be included in the error message.
      // It's better to provide a generic message to the client.
      clientMessage = `Invalid input provided for ${contextInfo}. Please check your data.`;
      // console.error("InvalidParameterException Details:", error.message);
      // Log the error message for debugging purposes, but do not expose it to the client.
      break;
    case 'ResourceNotFoundException':
      // Maybe a Cognito User Pool or another resource
      clientMessage = `A required resource was not found. Please contact support.`;
      break;
    default:
      // For unknown or generic errors, keep the default message
      // or customize it if you can extract something useful safely.
      console.warn(`[${contextInfo}] Unhandled error type: ${error.name}`);
      clientMessage = `An unexpected error occurred while ${contextInfo}. Please try again or contact support. Error Code: ${error.name || 'UNKNOWN'}`;
      break;
  }

  // Launch a new Error. AppSync will catch this and put it in the 'errors' array of the GraphQL response.
  throw new Error(clientMessage);
};
