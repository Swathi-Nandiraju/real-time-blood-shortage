"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true")
      router.push("/")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-red-600 to-red-900 text-white flex-col justify-center items-center p-10">

        <h1 className="text-4xl font-bold mb-4 text-center">
          Hyderabad Blood Intelligence
        </h1>

        <p className="text-lg text-center mb-6">
          Smart Blood Management & Prediction System
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
          alt="blood"
          className="w-40 h-40"
        />
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-xl w-80 space-y-4"
        >

          <h2 className="text-2xl font-bold text-center text-red-600">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-red-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-red-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded transition">
            Login
          </button>

        </form>
      </div>
    </div>
  )
}