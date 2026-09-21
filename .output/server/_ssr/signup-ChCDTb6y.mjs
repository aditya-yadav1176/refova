import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useAuth, g as deriveUsername } from "./router-BOn4884-.mjs";
import { C as EyeOff, F as ArrowLeft, S as Eye, o as UserPlus } from "../_libs/lucide-react.mjs";
import { r as cn, t as SiteHeader } from "./site-header-mE72LyKf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-ChCDTb6y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MIN_PW = 8;
function validate(fields) {
	const errors = {};
	if (!fields.name.trim()) errors.name = "Please enter your full name.";
	if (!fields.email.trim()) errors.email = "Please enter your email address.";
	else if (!EMAIL_RE.test(fields.email.trim())) errors.email = "Please enter a valid email address.";
	if (!fields.password) errors.password = "Please choose a password.";
	else if (fields.password.length < MIN_PW) errors.password = `Password must be at least ${MIN_PW} characters.`;
	if (!fields.confirmPassword) errors.confirmPassword = "Please confirm your password.";
	else if (fields.confirmPassword !== fields.password) errors.confirmPassword = "Passwords don't match.";
	return errors;
}
function SignUpPage() {
	const { user, signup, isLoading } = useAuth();
	const navigate = useNavigate();
	const [fields, setFields] = (0, import_react.useState)({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [fieldErrors, setFieldErrors] = (0, import_react.useState)({});
	const [serverError, setServerError] = (0, import_react.useState)(null);
	if (user) {
		navigate({
			to: "/profile/$username",
			params: { username: user.username }
		});
		return null;
	}
	const set = (key) => (e) => {
		setFields((prev) => ({
			...prev,
			[key]: e.target.value
		}));
		if (fieldErrors[key]) setFieldErrors((prev) => ({
			...prev,
			[key]: void 0
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError(null);
		const errors = validate(fields);
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}
		const result = await signup({
			name: fields.name.trim(),
			email: fields.email.trim(),
			password: fields.password
		});
		if (result.success) {
			const username = deriveUsername(fields.email);
			toast.success("Account created! Welcome to Refova.", { description: "Start by exploring referrals or posting your own." });
			navigate({
				to: "/profile/$username",
				params: { username }
			});
		} else setServerError(result.error);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "enter w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/login",
					className: "mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to login"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-foreground/15 bg-card p-8 shadow-card md:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl font-extrabold leading-tight tracking-tight",
								children: "Create your account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Join to discover, save and share referrals with the community."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							noValidate: true,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "name",
											className: "text-sm font-semibold",
											children: "Full name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "name",
											type: "text",
											autoComplete: "name",
											value: fields.name,
											onChange: set("name"),
											placeholder: "Jane Smith",
											"aria-invalid": !!fieldErrors.name,
											className: cn("h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30", fieldErrors.name ? "border-destructive/60 focus:ring-destructive/20" : "border-border")
										}),
										fieldErrors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											role: "alert",
											className: "text-xs text-destructive",
											children: fieldErrors.name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "email",
											className: "text-sm font-semibold",
											children: "Email address"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "email",
											type: "email",
											autoComplete: "email",
											value: fields.email,
											onChange: set("email"),
											placeholder: "you@example.com",
											"aria-invalid": !!fieldErrors.email,
											className: cn("h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30", fieldErrors.email ? "border-destructive/60 focus:ring-destructive/20" : "border-border")
										}),
										fieldErrors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											role: "alert",
											className: "text-xs text-destructive",
											children: fieldErrors.email
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "password",
											className: "text-sm font-semibold",
											children: "Password"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "password",
												type: showPassword ? "text" : "password",
												autoComplete: "new-password",
												value: fields.password,
												onChange: set("password"),
												placeholder: `At least ${MIN_PW} characters`,
												"aria-invalid": !!fieldErrors.password,
												className: cn("h-11 w-full rounded-xl border bg-background pl-4 pr-11 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30", fieldErrors.password ? "border-destructive/60 focus:ring-destructive/20" : "border-border")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPassword((v) => !v),
												"aria-label": showPassword ? "Hide password" : "Show password",
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground",
												children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
											})]
										}),
										fieldErrors.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											role: "alert",
											className: "text-xs text-destructive",
											children: fieldErrors.password
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Must be at least ",
												MIN_PW,
												" characters."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "confirmPassword",
											className: "text-sm font-semibold",
											children: "Confirm password"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "confirmPassword",
												type: showConfirmPassword ? "text" : "password",
												autoComplete: "new-password",
												value: fields.confirmPassword,
												onChange: set("confirmPassword"),
												placeholder: "Re-enter your password",
												"aria-invalid": !!fieldErrors.confirmPassword,
												className: cn("h-11 w-full rounded-xl border bg-background pl-4 pr-11 text-sm outline-none transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30", fieldErrors.confirmPassword ? "border-destructive/60 focus:ring-destructive/20" : "border-border")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowConfirmPassword((v) => !v),
												"aria-label": showConfirmPassword ? "Hide password" : "Show password",
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground",
												children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
											})]
										}),
										fieldErrors.confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											role: "alert",
											className: "text-xs text-destructive",
											children: fieldErrors.confirmPassword
										})
									]
								}),
								serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "alert",
									className: "rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive",
									children: serverError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isLoading,
									style: { boxShadow: isLoading ? "none" : "3px 3px 0 var(--ink)" },
									className: cn("press w-full rounded-xl border-2 border-foreground bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground", "disabled:cursor-not-allowed disabled:opacity-60"),
									children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" }), "Creating account…"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), "Create account"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 text-center text-sm text-muted-foreground",
							children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline",
									children: "Log in"
								})
							]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { SignUpPage as component };
