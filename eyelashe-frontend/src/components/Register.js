import React, { useState } from "react";
import { toast } from "react-toastify";

function Register() {  // <-- Make sure this line exists
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [consentForMarketing, setConsentForMarketing] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!firstName.trim()) newErrors.firstName = "First name is required.";
        if (!lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
        if (!email.trim()) newErrors.email = "Email is required.";
        if (!password) newErrors.password = "Password is required.";
        if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
        if (password!== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword,
                    firstName,
                    lastName,
                    phoneNumber,
                    consentForMarketing
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Registration successful 💅! Please login.", {
                    position: 'top-center',
                    autoClose: 3000,
                });
                setTimeout(() => window.location.href = "/login", 3000);
            } else {
                toast.error("Registration failed💔: " + data.message);
            }
        } catch (error) {
            toast.error("Something went wrong💔. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (  // <-- This return must be INSIDE the function
        <form onSubmit={handleRegister}>
            <div className="register-container">
                <button type="button" className="back-button" onClick={() => window.location.href = '/'}>← Back</button>

                <h1>Join Our Beauty Community!</h1>

                <div className="register-card">

                    <div className="form-row">
                    <input type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                    />
                    
                    <input type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                    />

                    </div>
                    {(errors.firstName || errors.lastName) && (
                        <div className="form-row">
                            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                        </div>
                    )}

                    <div className="form-row">
                    <input type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={loading}
                    />
                     <input type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    </div>
                   {(errors.phoneNumber || errors.email) && (
                    <div className="form-row">
                        {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                   )}
                   <div className="form-row">

                    <input type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                   

                    <input type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                    </div>
                    {(errors.password || errors.confirmPassword) && (
                        <div className="form-row">
                             {errors.password && <p className="error-text">{errors.password}</p>}
                                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>
                    )}
                   

                    <label className="checkbox-label">
                        <input type="checkbox"
                            checked={consentForMarketing}
                            onChange={(e) => setConsentForMarketing(e.target.checked)}
                            disabled={loading}
                        />
                        I agree to receive promotional emails about our latest offers and beauty tips.
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading? "Registering..." : "Register"}
                    </button>

                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </form>
    ) // <-- closes return
} // <-- closes function Register

export default Register;