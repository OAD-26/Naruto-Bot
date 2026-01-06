# Naruto Bot 🍥

## Overview

Naruto Bot is a WhatsApp bot built using the Baileys library (@whiskeysockets/baileys). It provides a wide range of features including group management, AI chat, media downloading, sticker creation, games, and various fun commands. The bot is designed to run continuously on Replit with an Express web server for uptime monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Architecture
- **Runtime**: Node.js (CommonJS modules)
- **WhatsApp Connection**: @whiskeysockets/baileys library for WhatsApp Web API integration
- **Web Server**: Express.js on port 3000 for health checks and uptime monitoring
- **Logging**: Pino for structured logging
- **QR Authentication**: qrcode-terminal for initial device pairing

### Command Structure
- Commands are organized in the `/Command` directory as individual modules
- Each command exports either a function or an object with `name`, `description`, and `execute` properties
- Commands use a prefix system (default: `.` or `!`)
- Commands are categorized: General, Admin, Group Management, Media, AI, Games, Fun

### Key Architectural Decisions

1. **Modular Command System**
   - Each command is a separate file in `/Command` directory
   - Allows easy addition/removal of features
   - Commands handle their own validation and error responses

2. **Multi-File Authentication State**
   - Uses Baileys' `useMultiFileAuthState` for persistent sessions
   - Session data stored locally for reconnection

3. **Express Health Endpoint**
   - Simple GET endpoint at `/` returns bot status
   - Designed for UptimeRobot or similar monitoring services

4. **Admin/Owner Permission System**
   - Owner numbers configured in main config
   - Commands check sender permissions before execution
   - Separate admin checks for group-specific commands

5. **Data Persistence**
   - JSON files in `/data` directory for feature states (antilink, welcomer, group settings)
   - Lightweight store pattern for message history

### Command Categories
- **General**: ping, alive, help, menu, owner, joke, quote, fact
- **AI**: GPT, Gemini integrations via external APIs
- **Media**: Instagram, Facebook, YouTube downloaders, sticker creation
- **Group Admin**: kick, ban, promote, demote, mute, unmute, hidetag
- **Moderation**: antilink, antispam, antidelete, antibadword
- **Fun**: 8ball, dare, truth, compliment, insult, character analysis
- **Utility**: translate, weather, news, lyrics, calculator

## External Dependencies

### NPM Packages
- **@whiskeysockets/baileys**: WhatsApp Web API client
- **express**: Web server for health monitoring
- **pino**: Logging library
- **qrcode-terminal**: QR code display for authentication
- **axios/node-fetch**: HTTP requests for external APIs
- **sharp**: Image processing for stickers and filters
- **yt-search**: YouTube search functionality
- **node-webpmux**: WebP sticker manipulation

### External APIs
- **AI Services**: GPT and Gemini via third-party API endpoints
- **Media Downloads**: Instagram (ruhend-scraper), Facebook, YouTube
- **Fun APIs**: Giphy, random jokes, facts, quotes
- **News**: NewsAPI for headlines
- **Google Books API**: Novel information lookup

### Data Storage
- Local JSON files in `/data` directory for:
  - Group settings and configurations
  - Antilink/antispam states
  - Welcome/goodbye messages
  - User preferences
  - Chatbot memory

### File System Usage
- `/tmp` directory for temporary media processing
- `/assets` for static bot assets (images, default stickers)
- `/auth_info` for session persistence