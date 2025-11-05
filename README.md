# Next.js Supabase Starter Template

Welcome! This is a starter template for building web applications with Next.js and Supabase. If you're new to coding, don't worry - this guide will walk you through everything step by step.

## What is This Template?

This template gives you a complete starting point for building a full web application that includes:
- **User authentication** (sign up, login, password reset)
- **Protected pages** (pages only logged-in users can see)
- Supabase database connection (database so your app can save stuff)
- Vercel Hosting (So your app can be on the public internet)

Think of it as a foundation you can build upon to create your own web application.

## What You'll Need Before Starting

Before you begin, you'll need to set up accounts and install software. Follow these steps in order:

### 1. Create Supabase Account (Free)

**What is Supabase?** Supabase handles user authentication (login/sign up) and can store your data. It's like having a backend server without needing to build one yourself.

**How to get an account:**
1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project" or "Sign up"
3. Create a free account (you can use your GitHub account to sign up faster)
4. Once logged in, click "New Project"
5. Fill in your project details:
   - **Name**: Give your project a name (like "my-first-app")
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the closest region to you
6. Click "Create new project"
7. Wait 2-3 minutes for your project to be set up

### 2. Create Free Vercel Account (Free)

**What is Vercel?** Vercel is a platform that hosts (puts your website on the internet) so other people can visit it. It's free for personal projects and works perfectly with Next.js.

**How to get an account:**
1. Go to [vercel.com](https://vercel.com/)
2. Click "Sign up" or "Start Deploying"
3. Create a free account (you can sign up with GitHub, GitLab, or Bitbucket - this makes deployment easier later!)
4. Verify your email if prompted
5. You're done! You'll use this account later to put your website online.
   
### 3. Install Node.js and NPM on Your Machine

**What is Node.js?** Node.js is a program that lets you run JavaScript on your computer. It also comes with npm (Node Package Manager), which helps you install the tools this project needs.

**How to install:**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the version labeled "LTS" (Long Term Support) - this is the most stable version
3. Run the installer and follow the instructions
4. Restart your computer after installation

**How to check if it's installed:**
- Open your terminal (on Mac: press `Cmd + Space`, type "Terminal", press Enter)
- On Windows: press `Windows Key + R`, type "cmd", press Enter
- Type these commands and press Enter after each:
  ```bash
  node --version
  npm --version
  ```
- You should see version numbers like `v20.10.0` and `10.2.3`. If you see errors, Node.js isn't installed correctly.

### 6. Install Cursor and Sign Up with Student Account

**What is Cursor?** Cursor is a code editor (like Microsoft Word, but for code) that has built-in AI assistance. It's perfect for beginners because it can help you write code and answer questions.

**How to install:**
1. Go to [cursor.sh](https://cursor.sh/)
2. Click "Download" or "Get Started"
3. Download the version for your operating system (Windows, Mac, or Linux)
4. Run the installer and follow the instructions
5. Open Cursor when installation is complete

**How to sign up with student account:**
1. Open Cursor
2. Click "Sign up" or "Get started"
3. Look for an option to sign up as a student (usually says "Student" or "Education")
4. Sign up using your student email address (the one from your school)
5. Verify your student status if prompted
6. **Note:** Student accounts often get free or discounted access to premium features!

**Alternative:** If you're not a student, you can still use Cursor with a free account, but some features might be limited.

### 7. Install Git

**What is Git?** Git is a tool that helps you track changes to your code and collaborate with others. Think of it like a time machine for your code - you can go back to earlier versions if something breaks.

**How to install:**

**On Mac:**
- Git usually comes pre-installed! Check by opening Terminal and typing `git --version`
- If it's not installed, you can install it by installing Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

**On Windows:**
1. Go to [git-scm.com](https://git-scm.com/)
2. Click "Download for Windows"
3. Run the installer
4. During installation, keep all the default options (just click "Next" through everything)
5. When it's done, restart your computer

**On Linux:**
- Open your terminal and run:
  ```bash
  sudo apt update
  sudo apt install git
  ```
- Or use your distribution's package manager

**How to check if it's installed:**
- Open your terminal
- Type this command and press Enter:
  ```bash
  git --version
  ```
- You should see something like `git version 2.42.0`. If you see an error, Git isn't installed correctly.

**Set up Git (first time only):**
After installing Git, you should tell it who you are. Run these commands in your terminal (replace with your name and email):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## How to make a copy of the template and get it running on your laptop:

<div align="center">
  
[![Watch the video](https://img.youtube.com/vi/CW8MT0-lWas/0.jpg)](https://www.youtube.com/watch?v=CW8MT0-lWas)

</div>

📺 **[Watch on YouTube](https://youtu.be/CW8MT0-lWas)**


## Common Problems and Solutions

### Problem: "Command not found" or "npm is not recognized"

**Solution:** Node.js isn't installed or isn't in your PATH. Go back to "What You'll Need Before Starting" and make sure Node.js is installed correctly.

### Problem: Website shows "Environment variables are missing"

**Solution:** 
- Make sure you created `.env.local` (not `.env.local.txt`)
- Make sure your file is in the root folder (same folder as `package.json`)
- Check that you copied your Supabase keys correctly (no extra spaces or quotes)
- After fixing the file, stop your server (`Ctrl+C`) and restart it (`npm run dev`)

### Problem: "Port 3000 is already in use"

**Solution:** Another program is using port 3000. Either:
- Close the other program, or
- Stop any other development servers you have running

### Problem: "Cannot find module" errors

**Solution:** 
- Make sure you ran `npm install` successfully
- Try deleting the `node_modules` folder and running `npm install` again
- Make sure you're in the correct project folder

### Problem: Supabase authentication not working

**Solution:**
- Double-check your `.env.local` file has the correct values
- Make sure your Supabase project is active (not paused)
- Check that you copied the "anon public" key, not the "service_role" key (service_role should stay secret!)
