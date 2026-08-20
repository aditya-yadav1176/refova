# Referral Hub

Referral Platform Website Concept

Build a high-fidelity frontend-only website prototype for a modern referral discovery and sharing platform. The goal is not to build the complete production product yet—I want a visually polished concept that helps me understand how the final product could look and feel.

Important Context

This is currently a website-first product. Do not design it like a mobile app stretched onto desktop.

Build with a modern web product feel suitable for a startup.

Focus heavily on UI/UX, layout, visual hierarchy, cards, interactions, and realistic content.

Frontend prototype only for now. Use mock data and simulated interactions.

Do not spend time implementing a complex backend.

Product Idea

This platform helps users discover, share, and manage referral links and referral codes.

Example use cases:

A user has a referral link/code for a service and wants to share it.

Another user is looking for a referral for a specific company/service.

Users can browse available referrals instead of searching randomly through WhatsApp groups, friends, Reddit, or multiple websites.

Users can post their referral opportunities with information about the benefit.

The platform should make referral sharing feel organized, trustworthy, easy, and community-driven.

The UI should communicate:

Discover → Verify value → Copy/Claim referral → Benefit

The main product should feel like a combination of a curated marketplace, community platform, and modern SaaS product, but specifically designed around referral opportunities.

Overall Design Direction

Create a modern editorial card-based interface with personality.

Avoid:

Generic corporate dashboard UI

Excessive glassmorphism

Overly dark cyberpunk style

Too much empty space

Basic template-like SaaS design

Making every section look like identical rounded rectangles

Preferred style:

Modern + playful + curated + slightly artistic + card-heavy

Use:

Clean light background

Strong typography

Soft but distinctive accent colors

Editorial-style layouts

Different card sizes to create visual hierarchy

Slightly playful illustrations/icons

Rounded corners, but not excessively rounded

Subtle shadows

Smooth micro-interactions

Interesting spacing and composition

Occasional stickers, badges, labels, or hand-crafted visual details

Think of the feeling as:

“A carefully curated place where the internet's useful referral offers are organized beautifully.”

Use a responsive design, with desktop as the primary experience and tablet/mobile adaptations.

Website Pages / Screens

Create the following screens and make navigation work between them.

1. Landing / Home Page

This should immediately explain the platform visually without requiring a long explanation.

Navbar

Include:

Discover

Categories

How it Works

Post a Referral

Search icon

Login / Sign Up button

Make Post a Referral the strongest CTA.

Hero Section

Create a bold headline around the idea:

“Find referrals. Share benefits.”

You can improve the wording if necessary, but do not assign a platform name.

Supporting text should explain that users can discover useful referral links and codes from people and communities.

Include:

Main CTA: Explore Referrals

Secondary CTA: Share a Referral

A visually interesting hero composition showing multiple floating referral cards

Example floating cards can show fictional referral opportunities such as:

₹500 off

Get 1 month free

₹1,000 reward

Extra discount

Invite benefit

The hero should feel dynamic and immediately communicate what the product does.

2. Featured Referrals Section

Below the hero, create a section with:

Featured right now

Use an interesting asymmetrical card grid.

Each referral card should contain:

Company/service logo placeholder

Category

Referral benefit

Short description

“Posted by” user

Time posted

Small trust/verification indicator

Copy Referral button

Use realistic fictional examples from categories like:

Finance

Shopping

Food

Travel

Productivity

Education

Developer tools

Do not make all cards identical.

For example:

One large highlighted card

Two medium cards

Multiple compact cards

Make this section visually rich enough to be the main inspiration for the product UI.

3. Browse by Category

Create visually distinct category cards for:

Finance & Payments

Shopping

Food & Delivery

Travel

Education

Productivity

Developer Tools

Entertainment

Each category should have:

Icon or illustration

Number of available referrals

Different subtle accent treatment

Avoid a boring grid of identical buttons. Make it feel curated and browsable.

4. Search / Discover Page

Create a dedicated discovery page.

At the top:

Large search input

Placeholder: “Search companies, services or benefits...”

Search suggestions/tags

Include filter controls for:

Category

Benefit type

Newest

Most popular

Verified

Show a rich results layout with referral cards.

Users should be able to:

Search

Filter

Sort

Open a referral card

Copy a referral

Use mock interactions.

Add a useful empty state if a search returns no results.

5. Referral Detail Page

When a user opens a referral, show a detailed page.

Include:

Company/service identity area

Large benefit statement

Example: “Get ₹500 when you complete your first transaction”

Category and tags

Full explanation

Important conditions

Referral code or referral link area

Large Copy Referral button

Share button

Posted by user profile

Posted date

Usage/engagement indicator

Report referral option

The referral code/link should initially be partially hidden or visually protected, with the primary interaction encouraging the user to copy it.

After clicking Copy:

Show a satisfying confirmation state

Change button temporarily to Copied!

Include a subtle animation or success feedback

Below it, add:

Similar referrals

6. Post a Referral Page

Create a clean, friendly multi-section form for posting a referral.

Fields:

Company / Service Name

Category

Referral Benefit

Description

Referral Link or Code

Terms / Conditions

Expiry Date

Optional proof or verification information

Include a preview panel on desktop showing approximately how the referral card will look while filling the form.

At the bottom:

Publish Referral

Since this is frontend-only, simulate successful submission with a polished success state.

7. User Profile Page

Create a simple public-style profile/dashboard.

Include:

Avatar

Username

Short bio

Member since

Referrals shared

Successful copies / engagement

Trust score or helpful contributor badge

Sections:

Active Referrals

Past Referrals

Saved Referrals

Use referral cards, but adapt them for profile context.

Core UI Components

Design reusable components for:

Referral Card

The most important component in the product.

Create multiple visual variations:

Featured

Standard

Compact

List view

Every variation should still clearly belong to the same design system.

Benefit Badge

Examples:

₹500 OFF

1 MONTH FREE

₹1,000 REWARD

20% DISCOUNT

Make benefit badges visually prominent.

Trust Indicators

Examples:

Verified

Community Trusted

New

Expiring Soon

Do not overuse verification badges.

Copy Interaction

The copy action should feel central to the product.

Include:

Copy icon

Clear CTA

Success state

Optional small toast notification

Save Interaction

Allow users to save/bookmark referrals with a heart or bookmark icon.

Homepage Visual Structure

Use approximately this flow:

Navbar

Hero with floating referral cards

Trusted/community benefit strip

Featured referrals

Browse categories

“How it works” — simple 3-step flow

Discover → Copy → Benefit

Popular / trending referrals

CTA encouraging users to share their own referral

Footer

Make the page feel substantial and like a real startup product, not a single landing-page mockup.

Typography and Visual System

Use strong, modern typography.

Suggested direction:

Bold, expressive font for headings

Clean sans-serif for UI and body text

Large hero typography

Strong contrast between headline and supporting content

Create a consistent system for:

Spacing

Border radius

Card styles

Buttons

Tags

Icons

Shadows

Hover states

Use a mostly light interface, with dark text and a carefully chosen set of accent colors.

Possible palette direction:

Warm off-white / cream background

Near-black typography

Bright accent color for CTAs

Secondary accents such as soft purple, orange, green, or blue for category differentiation

Do not make the entire interface rainbow-colored. Keep the overall system cohesive.

Interactions and Motion

Add subtle, polished motion:

Cards lift slightly on hover

Buttons have satisfying hover/press states

Floating hero cards have gentle movement

Copy button transitions to success

Page navigation feels smooth

Saved state has a subtle animation

Referral cards reveal small additional details on hover where appropriate

Animations should support the experience, not distract from it.

Content Rules

Use realistic mock content.

Do not use lorem ipsum.

Use fictional/sample referral data where needed.

Examples of benefit language:

Get ₹500 after your first successful payment

Invite a friend and both get rewards

Get 20% off your first order

Unlock one month free

Earn credits after completing your first booking

Keep content concise and easy to scan.

Final Goal

The final result should look like a real, polished startup website prototype that could be shown to users, teammates, or investors.

Prioritize visual exploration and product clarity over backend functionality.

I want to open the website and immediately understand:

What is this product?

→ A place to discover and share referrals.

What can I do here?

→ Browse, search, copy, save, and post referrals.

Why would I use it?

→ Find useful referral benefits quickly instead of searching across multiple platforms.

Make the referral cards and discovery experience the visual centerpiece of the entire product.

For now, keep the platform completely unnamed. Do not create a fictional brand name anywhere in the UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ab9e522d-5dce-4d8b-9430-0a8a19ab3607).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
