# OpenSourceIssueAnalyser

A tool that analyzes GitHub repositories to:
- Label issues by difficulty (Easy / Medium / Hard)
- Suggest good first issues for beginners
- Detect stale issues
- Highlight possible duplicate issues

## Why this matters
Open source beginners struggle to find approachable issues.  
This tool helps contributors and maintainers improve collaboration.

## Tech Stack
- React
- Node.js + Express
- GitHub REST API

## Features
- Rule-based difficulty scoring
- Beginner-friendly issue detection
- Stale issue detection
- Duplicate issue detection using text similarity

## Example Repositories
- sugarlabs/musicblocks
- sugarlabs/sugar

## Setup

### Backend
```bash
cd backend
npm install
npm start
