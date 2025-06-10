"use client"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import type z from "zod"
import { signupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { toast } from "sonner"
import { useCreateUserAccount, useGetCurrentUser, useSignInAccount } from "@/lib/react-query/queriesAndMutations"


const SignupForm = () => {
  const { refetch: getCurrentUser} = useGetCurrentUser();
  const { mutateAsync: createUserAccount, isPending: isCreatingsUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount} = useSignInAccount();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    const newUser = await createUserAccount(values);
    
    if (!newUser) {
      toast.error("Failed to create account. Please try again.");
      return;
    }

    console.log("New user created:", newUser);

    // Automatically sign in the user after account creation
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast.error("Failed to sign in. Please try again.");
    }

    const isLoggedIn = await getCurrentUser();

    if (isLoggedIn) {
      form.reset();
      toast.success("Account created successfully! Redirecting to your profile...");
      navigate("/");
    } else {
      return toast.error("Sign Up failed. Please try again.");
    }

  }

  return (
    <Form {...form}>
      <div className="flex items-center flex-col">
        <img src="/assets/images/logo.png" className="w-50" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5">
          Create a New Account
        </h2> 

        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Socinx, please enter your account details
        </p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingsUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
