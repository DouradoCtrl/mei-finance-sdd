import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function handle(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    const targetPath = path.join("/");
    
    const laravelBaseUrl = process.env.LARAVEL_API_URL || "http://localhost:8000";
    
    // Resolve full target URL with search parameters
    const targetUrl = `${laravelBaseUrl}/api/${targetPath}${req.nextUrl.search}`;

    try {
        const body = req.method !== "GET" && req.method !== "HEAD" 
            ? await req.text() 
            : undefined;

        // Clone and prepare headers to send to Laravel
        const headers = new Headers();
        req.headers.forEach((value, key) => {
            // Skip host header to prevent CORS issues
            if (key.toLowerCase() !== "host") {
                headers.set(key, value);
            }
        });

        // Inject NextAuth session token
        const session = await getServerSession(authOptions);
        if (session?.user?.accessToken) {
            headers.set("Authorization", `Bearer ${session.user.accessToken}`);
        }

        // Ensure JSON acceptance
        headers.set("Accept", "application/json");

        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
            // Disable caching for proxy requests
            cache: "no-store"
        });

        const resBody = await response.text();
        
        // Return standard response with headers
        const resHeaders = new Headers();
        response.headers.forEach((value, key) => {
            resHeaders.set(key, value);
        });

        return new NextResponse(resBody, {
            status: response.status,
            headers: resHeaders
        });
    } catch (error: any) {
        console.error("BFF Proxy Error:", error);
        return NextResponse.json({
            success: false,
            message: "Erro de comunicação com o servidor backend."
        }, { status: 502 });
    }
}

export { 
    handle as GET, 
    handle as POST, 
    handle as PUT, 
    handle as DELETE, 
    handle as PATCH 
};
