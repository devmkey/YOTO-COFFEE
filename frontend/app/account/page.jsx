"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { getProfile, updateProfile } from "../../lib/api";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";

export default function AccountPage() {
  const { user, token, loading, updateUserState } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && token) {
      getProfile(token)
        .then((data) => {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            contact: data.user.contact || "",
          });
          setIsFetching(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load profile data.");
          setIsFetching(false);
        });
    }
  }, [user, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);
    try {
      const data = await updateProfile(formData, token);
      updateUserState(data.user);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isFetching) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-coffeeLight">Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-coffeeDark text-cream">
      <div className="max-w-xl mx-auto bg-coffee/50 backdrop-blur-md p-8 rounded-2xl border border-coffee/20 shadow-xl">
        <h1 className="text-3xl font-playfair font-semibold mb-6 text-gold">My Account</h1>
        <p className="text-coffeeLight mb-8">Update your profile information below.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-coffeeLight">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-coffee border border-coffeeLight/20 rounded-lg focus:outline-none focus:border-gold transition-colors text-cream"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-coffeeLight">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-coffee border border-coffeeLight/20 rounded-lg focus:outline-none focus:border-gold transition-colors text-cream"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-coffeeLight">Contact (Optional)</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-coffee border border-coffeeLight/20 rounded-lg focus:outline-none focus:border-gold transition-colors text-cream"
              placeholder="Phone number or other contact"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
