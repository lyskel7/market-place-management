import { configureAmplify } from '@/lib/amplify/amplify';
import {
  errorResponse,
  settingCookies,
  successResponse,
} from '@/utils/apiResponses';
import { confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';

configureAmplify();

export async function POST(request: Request) {
  try {
    const { username, newPassword } = await request.json();

    if (!newPassword) {
      return errorResponse('Username or password not present', 400);
    }

    const confirmSignInOutput = await confirmSignIn({
      challengeResponse: newPassword,
      options: {
        userAttributes: {
          name: username,
        },
      },
    });

    console.log('cofirm: ', confirmSignInOutput);

    if (confirmSignInOutput.isSignedIn) {
      // Successful confirmation, getting final session and rol
      const session = await fetchAuthSession({ forceRefresh: true });

      if (!session.tokens) {
        return errorResponse(
          'Could not retrieve session tokens after confirming sign in.',
          401,
        );
      }

      // const role = extractUserRoleFromSession(session);
      // const idToken = session.tokens.idToken?.toString();
      // const accessToken = session.tokens.accessToken.toString();

      const cookies = settingCookies(session);
      return successResponse(
        confirmSignInOutput,
        'Password confirmed successfully. Login complete.',
        200,
        cookies,
      );
    }
    // else {
    //   // Manejar otros posibles nextStep si los hubiera (poco común aquí)
    //   console.warn(
    //     'Sign in not fully complete after confirm, next step:',
    //     confir.nextStep,
    //   );
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: `Sign-in confirmation incomplete: ${output.nextStep?.signInStep}`,
    //     },
    //     { status: 400 },
    //   );
    // }
    // if (
    //   user.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
    // ) {
    //   return successResponse({ user }, 'Password change required', 202);
    //   // return NextResponse.json(user, { status: 202 });
    // }

    // const session = await fetchAuthSession();
    // console.log('session: ', session);

    // const idToken = session.tokens?.idToken?.toString();
    // const accessToken = session.tokens?.accessToken.toString();

    // // const response = NextResponse.json({ user }, { status: 200 });
    // const cookies = [];

    // if (idToken) {
    //   cookies.push({
    //     name: 'token',
    //     value: idToken,
    //     options: {
    //       httpOnly: true,
    //       secure: true,
    //       path: '/',
    //       sameSite: 'strict',
    //     },
    //   });
    // }

    // if (accessToken) {
    //   cookies.push({
    //     name: 'accessToken',
    //     value: accessToken,
    //     options: {
    //       httpOnly: true,
    //       secure: true,
    //       path: '/',
    //       sameSite: 'strict',
    //     },
    //   });
    // }

    // successResponse(confirmSignInOutput,'Password changed successfully');
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
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: error.message,
    //     },
    //     { status: 401 },
    //   );
    // }
    // return NextResponse.json(`Error unknow: ${error}`);
  }
}
