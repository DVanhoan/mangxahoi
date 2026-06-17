import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });




  const handleLoginWithGoogle = async (credential) => {
    try {
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    } catch (err) {
      console.error("Google login error:", err);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-extrabold text-black">{"dvh"} media.</h1>
          <label className="input input-bordered rounded flex items-center gap-2 bg-gray-100 text-black">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2 bg-gray-100 text-black">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Đăng nhập"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>




        <div className="flex flex-col gap-2 mt-4">
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-60">
              Đăng ký
            </button>
          </Link>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <GoogleLogin
            shape="pill"
            size="large"
            width="240"
            text="signin_with"
            theme="outline"
            onSuccess={(credentialResponse) => {
              handleLoginWithGoogle(credentialResponse.credential);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

      </div>
    </div>
  );
};
export default LoginPage;
