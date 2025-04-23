import { signIn, fetchAuthSession, signOut } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify/amplify';
import {
  errorResponse,
  settingCookies,
  successResponse,
} from '@/utils/apiResponses';

configureAmplify();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await signOut();
    const signInOutput = await signIn({ username: email, password });
    console.log('output: ', signInOutput);

    if (
      signInOutput.nextStep.signInStep ===
      'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
    ) {
      return successResponse({ signInOutput }, 'Password change required', 202);
      // return NextResponse.json(user, { status: 202 });
    }

    const session = await fetchAuthSession();
    console.log('session: ', session);
    if (!session.tokens) {
      return errorResponse(
        'Could not retrieve session tokens after sign in.',
        401,
      );
    }
    const cookies = settingCookies(session);
    return successResponse(
      { signInOutput, session },
      'Login successful',
      200,
      cookies,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.message);
      return errorResponse(error.message, 401);
      // return NextResponse.json(
      //   {
      //     success: false,
      //     message: error.message,
      //   },
      //   { status: 401 },
      // );
    }
    // return NextResponse.json(`Error unknow: ${error}`);
    return errorResponse('Error unknow', 500);
  }
}
