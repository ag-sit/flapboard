# Next.js Supabase Starter Template

Welcome! This is a starter template for building web applications with Next.js and Supabase. If you're new to coding, don't worry - this guide will walk you through everything step by step.

## What is This Project?

This template gives you a complete starting point for building a web application that includes:
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

## Quick Start Video Tutorial

**Prefer watching a video?** We have a step-by-step video tutorial that walks you through:
- Forking the repository
- Cloning it locally
- Installing dependencies (`npm install`)
- Setting up your environment variables (`.env.local`)
- Getting your Supabase values
- Running the development server (`npm run dev`)

<div align="center">
  
[![Watch the video](https://img.youtube.com/vi/CW8MT0-lWas/0.jpg)](https://www.youtube.com/watch?v=CW8MT0-lWas)

</div>

📺 **[Watch on YouTube](https://youtu.be/CW8MT0-lWas)**

If you prefer written instructions, continue reading the detailed step-by-step guide below.

## Step-by-Step Setup Instructions

Follow these steps in order. If you get stuck, read each step carefully before moving to the next one.

### Step 1: Open This Project in Cursor

1. Open Cursor (the code editor you installed in the prerequisites)
2. Click **File** → **Open Folder** (or press `Ctrl+K` then `Ctrl+O` on Windows/Linux, or `Cmd+O` on Mac)
3. Navigate to the folder where you downloaded or cloned this project
4. Click "Select Folder"

You should now see all the project files in the left sidebar of Cursor.

**✅ Success Criteria - You're ready to continue when:**
- You can see the project folder name in the top-left of Cursor
- You can see files and folders (like `app`, `components`, `package.json`) in the left sidebar
- You can click on files and they open in the editor

### Step 2: Open the Terminal in Cursor

**What is a terminal?** The terminal is a text-based way to run commands on your computer. It's like having a conversation with your computer using typed commands.

**How to open it:**
- In Cursor: Press `` Ctrl + ` `` (that's the backtick key, usually above Tab)
- Or go to **Terminal** → **New Terminal** in the menu
- You should see a window at the bottom of your screen with a prompt (usually showing your current folder path)

**✅ Success Criteria - You're ready to continue when:**
- You see a terminal window at the bottom of Cursor
- The terminal shows a prompt (like `$` or `>` or a path like `/home/username/project-name`)
- You can type in the terminal and see your text appear
- The terminal path shows your project folder name

### Step 3: Install Project Dependencies

**What are dependencies?** These are code libraries (pieces of code written by other developers) that this project needs to work. Think of them like ingredients you need to cook a recipe.

**What to do:**
1. Make sure your terminal is open (from Step 2)
2. Type this command and press Enter:
   ```bash
   npm install
   ```
3. Wait for it to finish (this might take 1-3 minutes)
4. You'll see lots of text scrolling by - this is normal! It's installing all the necessary packages.
5. When it's done, you'll see your command prompt again (the `$` or `>` symbol)

**If you see an error:**
- Make sure you ran `npm install` from the project folder
- Make sure Node.js is installed (check Step 1 above)
- Try closing and reopening your terminal, then run the command again

**✅ Success Criteria - You're ready to continue when:**
- The `npm install` command finished without errors
- You see a message like "added XXX packages" or "audited XXX packages"
- Your command prompt is back (you can type a new command)
- A `node_modules` folder appears in your project sidebar (this might be hidden by default)

### Step 4: Get Your Supabase Keys

**What are these keys?** These are like passwords that let your website communicate securely with Supabase. You need two values:

1. **Project URL**: This is like the address of your Supabase project
2. **Anon/Public Key**: This is a special key that's safe to use in your website's code

**How to find them:**
1. Go to [app.supabase.com](https://app.supabase.com/) and log in
2. Click on your project (the one you created earlier)
3. Click on the **Settings** icon (gear icon) in the left sidebar
4. Click on **API** in the settings menu
5. You'll see two important values:
   - **Project URL**: Copy this value (it looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key**: Copy this value (it's a long string of letters and numbers)
6. Keep these values handy - you'll need them in the next step!

**✅ Success Criteria - You're ready to continue when:**
- You have copied your Project URL (starts with `https://` and ends with `.supabase.co`)
- You have copied your anon public key (a long string of characters, usually starts with `eyJ`)
- Both values are saved somewhere safe (like a text file or notes app) so you can paste them in the next step

### Step 5: Create Your Environment File

**What is an environment file?** This is a special file that stores secret information (like your Supabase keys) that your website needs to work. This file is kept private and never shared publicly.

**What to do:**
1. In your code editor, look at the left sidebar where all your files are listed
2. You might see a file called `.env.example` - that's a template
3. Create a new file called `.env.local`:
   - Right-click in the file explorer sidebar
   - Click "New File"
   - Type exactly: `.env.local` (including the dot at the beginning!)
4. Open the `.env.local` file you just created
5. Copy and paste these lines into the file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   ```
6. Replace `your-project-url-here` with the Project URL you copied from Supabase
7. Replace `your-anon-key-here` with the anon public key you copied from Supabase
8. Your file should look something like this (but with your actual values):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example-key-here
   ```
9. Save the file (press `Ctrl+S` on Windows/Linux or `Cmd+S` on Mac)

**Important:** 
- Don't share this file with anyone! It contains your secret keys.
- Make sure there are no spaces around the `=` sign
- Make sure there are no quotes around your values (unless Supabase shows them with quotes)

**✅ Success Criteria - You're ready to continue when:**
- You have created a file named `.env.local` in your project root folder (same folder as `package.json`)
- The file contains two lines: `NEXT_PUBLIC_SUPABASE_URL=` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`
- Both lines have your actual Supabase values (not `your-project-url-here` or `your-anon-key-here`)
- The file is saved (you should see it in your file explorer, though it might be hidden by default)

### Step 6: Start Your Development Server

**What is a development server?** This is a program that runs your website on your computer so you can see it in your browser and test it. It automatically updates when you make changes to your code.

**What to do:**
1. Make sure your terminal is still open (from Step 2)
2. Type this command and press Enter:
   ```bash
   npm run dev
   ```
3. Wait a few seconds - you'll see some text appear
4. Look for a line that says something like:
   ```
   ▲ Next.js 15.x.x
   - Local:        http://localhost:3000
   ```
5. When you see that message, your server is running!

**What to expect:**
- The terminal will keep running (don't close it while you're working!)
- You might see some warnings or messages - that's usually okay
- If you see an error in red, read what it says - it might tell you what's wrong

**✅ Success Criteria - You're ready to continue when:**
- The terminal shows a message like "▲ Next.js 15.x.x" or similar
- You see a line that says "Local: http://localhost:3000" (or similar)
- The terminal is still running (not showing an error that stopped it)
- The terminal might show "Ready" or "compiled successfully" messages

### Step 7: View Your Website

**What to do:**
1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. In the address bar at the top, type:
   ```
   http://localhost:3000
   ```
3. Press Enter
4. You should see your website!

**What you should see:**
- A page with "Next.js Supabase Starter" at the top
- Some buttons and text explaining the next steps
- If you see a warning about environment variables, double-check Step 5 - you might have made a typo in your `.env.local` file

**✅ Success Criteria - You're ready to continue when:**
- Your browser shows your website (not an error page)
- You can see the homepage content (like "Next.js Supabase Starter" or similar)
- The page loads without showing "Environment variables are missing" or similar errors
- You can click around and interact with the page

## How to Use Your Website

### Testing User Authentication

1. **Sign Up**: Click the "Sign Up" button and create a new account
2. **Check Your Email**: Supabase will send you a confirmation email
3. **Confirm Your Email**: Click the link in the email to confirm your account
4. **Log In**: Use your email and password to log in
5. **Protected Page**: Once logged in, you can access protected pages (try navigating to `/protected`)

### Making Changes

- Edit any file in the `app` folder to change what appears on your website
- Edit files in the `components` folder to change how things look
- After saving your changes, your browser will automatically refresh to show the updates!

## Stopping Your Development Server

When you're done working:
1. Go back to your terminal
2. Press `Ctrl+C` (or `Cmd+C` on Mac)
3. This stops the server
4. You can close the terminal or start it again later with `npm run dev`

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
