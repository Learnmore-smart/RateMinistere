import GoogleProvider from 'next-auth/providers/google'
import dbConnect from "@/app/lib/dbConnect"
import User from "@/app/models/user" // Ensure you have this model

export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect()

            try {
                // Check if user already exists
                let existingUser = await User.findOne({ email: user.email })

                if (!existingUser) {
                    // Generate a unique username
                    let username;
                    let isUnique = false;

                    while (!isUnique) {
                        // Generate a random 5-digit number
                        const randomNum = Math.floor(10000 + Math.random() * 90000);
                        username = `Rate${randomNum}`;

                        // Check if this username already exists
                        const userWithSameName = await User.findOne({ name: username });
                        if (!userWithSameName) {
                            isUnique = true;
                        }
                    }

                    // Create new user with generated username
                    existingUser = await User.create({
                        email: user.email,
                        name: username,
                        createdAt: new Date()
                    })
                }

                return true
            } catch (error) {
                console.error("User sign-in error:", error)
                throw new Error(JSON.stringify({
                    error: "Login failed",
                    redirect: "/"
                }))
            }
        },
        async session({ session, token }) {
            // Find the user in the database to get the createdAt date and updated name
            await dbConnect()
            const user = await User.findOne({ email: session.user.email })

            if (user) {
                session.user.id = user._id.toString()
                session.user.createdAt = user.createdAt
                session.user.name = user.name // update the name
            }

            return session
        },
        async jwt({ token, user, account, profile }) {
            // If it's a new sign-in, add user info to the token
            if (user) {
                token.id = user.id
                token.email = user.email
                token.createdAt = user.createdAt || new Date()
            }

            return token
        },
        cookies: {
            sessionToken: {
                name: `__Secure-next-auth.session-token`,
                options: {
                    domain: ".rateministere.com", // Set to your main domain
                    path: '/',
                    httpOnly: true,
                    secure: true,
                },
            },
        },
    },
    events: {
        async signIn(message) {
            console.log('Sign in event', message)
        },
        async createUser(message) {
            console.log('User created', message)
        }
    },
    pages: {
        signIn: '/',
        error: '/'
    },
    // Add debug for development
    debug: process.env.NODE_ENV === 'development'
}