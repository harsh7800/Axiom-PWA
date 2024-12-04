import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // // console.log(`Middleware invoked for: ${request.nextUrl.pathname}`);

  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = `${process.env.NEXT_PUBLIC_PROD_SITE_URL}/login`;
      const signupUrl = `${process.env.NEXT_PUBLIC_PROD_SITE_URL}/signup`;

      // Redirect to signup if the user is trying to access the signup page
      if (request.nextUrl.pathname === "/signup") {
        // return NextResponse.redirect(signupUrl);
        return NextResponse.redirect("/signup");
      }

      // Redirect to login for all other pages
      // return NextResponse.redirect(loginUrl);
      return NextResponse.redirect("/login");
    }

    return response;
  } catch (e) {
    console.error("Error in updateSession:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
