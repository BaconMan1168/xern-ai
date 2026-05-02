# Xern AI

Xern AI turns messy customer feedback into build-ready product specs.

It helps product managers, founders, and builders synthesize feedback from interviews, notes, tickets, and documents into structured feature proposals with real user evidence, suggested UI changes, data model changes, workflow changes, and engineering tasks — ready to export as Markdown and paste into AI coding tools.

**Live Demo:** https://www.xernai.com

---

## Problem

Product discovery is still one of the slowest parts of software development.

Teams often collect feedback across many disconnected sources:

- Customer interviews
- Support tickets
- Product notes
- User research docs
- Feature requests
- Internal feedback
- JSON or Markdown exports
- PDFs and written reports

The challenge is not just collecting feedback. The challenge is converting it into clear product decisions.

Common pain points include:

- Feedback is messy and unstructured
- Important user pain points are hard to identify across multiple files
- Product managers spend too much time analyzing instead of deciding
- Engineering teams need clearer specs before building
- AI coding tools are powerful, but still need well-structured product direction
- Valuable customer evidence is often lost when turning feedback into requirements

Xern AI addresses this upstream bottleneck by helping users move from feedback to feature proposal faster.

---

## Solution

Xern AI analyzes uploaded customer feedback and generates structured feature proposals.

Users can create a project, upload multiple files, paste feedback directly into the app, run AI analysis, review synthesized themes, and export generated proposals as Markdown.

Each generated proposal can include:

- Problem summary
- Supporting user evidence
- Real user quotes
- Common themes and pain points
- Suggested UI changes
- Suggested data model changes
- Workflow changes
- Engineering tasks
- Build-ready Markdown output

The goal is to make product discovery outputs immediately useful for builders, founders, product managers, and AI-assisted development workflows.

---

## What Xern AI Does

Xern AI currently supports the following workflow:

1. **Create a project**

   Users can create a dedicated project for a set of customer feedback, product research, or discovery notes.

2. **Upload or paste feedback**

   Users can upload multiple files or paste text directly into the app.

   Supported input types include:

   - `.docx`
   - `.md`
   - `.json`
   - `.txt`
   - `.pdf`
   - Copy/pasted text

3. **Run AI analysis**

   Xern AI processes the feedback and uses Claude Sonnet 4.6 to synthesize recurring themes, pain points, and opportunities.

4. **Generate feature proposals**

   The app turns feedback themes into structured product proposals with practical implementation guidance.

5. **Export as Markdown**

   Generated specs can be exported as clean Markdown, making them easy to paste into tools like Cursor, Claude Code, Linear, Jira, GitHub Issues, or internal documentation.

---

## Use Case and Impact

Xern AI is designed for anyone who needs to turn customer feedback into product direction.

### Primary users

- Product managers
- Founders
- Startup teams
- Customer-facing teams

### Real-world use cases

Xern AI can be used to:

- Analyze customer interview notes
- Review support tickets for feature opportunities
- Turn user research into product requirements
- Convert messy feedback into structured specs
- Create engineering-ready tasks from customer pain points
- Prepare product proposals for AI coding tools
- Identify repeated issues across multiple feedback sources
- Speed up the transition from discovery to execution

### Impact

Xern AI helps reduce the manual work between customer discovery and product development.

By generating structured, evidence-backed proposals, it helps teams:

- Make faster product decisions
- Preserve real customer evidence
- Reduce time spent manually summarizing feedback
- Improve alignment between product and engineering
- Create clearer specs for AI-assisted development
- Build features based on actual user needs

The larger vision is to make Xern AI the bridge between customer feedback and product execution.

---

## Architecture

Xern AI is built as a modern full-stack web application using:

- **Next.js** for the application framework
- **TypeScript** for type-safe development
- **Tailwind CSS** for styling
- **Supabase** for authentication, database persistence, and file storage
- **Claude Sonnet 4.6** for AI analysis and proposal generation
- **Stripe** for subscription and billing infrastructure
- **Vercel** for deployment and hosting

---

## High-Level System Design

```txt
User
  |
  v
Next.js Frontend
  |
  |-- Project creation
  |-- File upload
  |-- Text input
  |-- Analysis dashboard
  |-- Proposal review
  |-- Markdown export
  |
  v
Next.js API / Server Logic
  |
  |-- File parsing
  |-- Plan permission checks
  |-- AI analysis requests
  |-- Proposal generation
  |-- Persistence logic
  |
  v
Supabase
  |
  |-- Auth
  |-- Database
  |-- File storage
  |
  v
Claude Sonnet 4.6
  |
  |-- Theme synthesis
  |-- Evidence extraction
  |-- Feature proposal generation
  |
  v
Generated Build-Ready Specs
```

---

## Implementation Details

### Frontend

The frontend is built with Next.js, TypeScript, and Tailwind CSS.

The user interface is organized around a project-based workflow. Users can create projects, add feedback inputs, run analysis, review generated proposals, and export the final output.

The UI is designed to make the workflow feel simple:

```txt
Create project → Add feedback → Run analysis → Review proposals → Export Markdown
```

### Authentication

Xern AI uses Supabase Auth to manage user authentication.

Authenticated users can create and manage their own projects, upload files, and access their generated analysis results.

### File Uploads and Storage

Uploaded files are stored using Supabase Storage and associated with project records in the database.

Supported file types include:

- PDF
- DOCX
- Markdown
- JSON
- TXT
- Pasted text input

Each uploaded or pasted input is connected to a project so the analysis can be run across multiple feedback sources.

### Database

Supabase is used to persist core product data.

The database can include records for:

- Users
- Projects
- Uploaded files
- Parsed feedback content
- AI analysis results
- Generated proposals
- Subscription and usage data

This structure allows users to return to previous projects, review past analysis, and access generated outputs without starting over.

### AI Analysis Pipeline

Xern AI uses Claude Sonnet 4.6 to analyze customer feedback and generate product proposals.

The AI pipeline focuses on:

1. Extracting meaningful feedback from uploaded or pasted inputs
2. Identifying recurring themes and user pain points
3. Preserving real user evidence and quotes
4. Converting themes into structured feature proposals
5. Formatting the output for product and engineering use

### Proposal Generation

Generated proposals are structured to help builders understand both the product reasoning and the implementation direction.

A proposal may include:

- The user problem
- Evidence from feedback
- Relevant quotes
- Recommended product changes
- UI updates
- Data model updates
- Workflow changes
- Engineering tasks

This makes the output useful for both human teams and AI coding tools.

### Markdown Export

Xern AI outputs proposals in clean Markdown.

Markdown was chosen because it is portable, readable, and easy to use across modern development workflows. Users can paste the generated specs into:

- Cursor
- Claude Code
- GitHub Issues
- Linear
- Jira
- Notion
- Internal product docs

This makes Xern AI useful as a bridge between product discovery and execution.

### Subscriptions and Plan Permissions

Stripe is used for subscription and billing infrastructure.

Xern AI is designed around different plan-based permissions, which can control usage such as:

- Number of projects
- Number of uploaded files
- Number of AI analysis runs
- Access to saved sessions
- Access to premium features

This helps the product scale responsibly by connecting user access to subscription state and AI usage costs.

---

## Scalability

Xern AI is designed to scale through a modern serverless architecture.

The app is deployed on Vercel, which allows the frontend and server-side logic to scale with user traffic. Supabase handles authentication, database records, and file storage, making it easier to support more users and more projects over time through built-in connection pooling.

Plan-based permissions also help with scalability. Since AI processing and file analysis can become expensive as usage grows, Xern AI can manage access through subscription limits such as project counts, file limits, and analysis runs.

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| AI Model | Claude Sonnet 4.6 |
| Payments | Stripe |
| Hosting | Vercel |
