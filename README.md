# Library Online 
## TypeScript Weather & Book Search Application

A TypeScript based application that integrates weather book recommendations with a book search system using two APIs and async programming patterns.

### API Integration
- **Weather API**: Open-Meteo API for location weather data with book recommendations
- **Library API**: OpenLibrary API for book search

## Features

### Weather Integration
- **Real-time weather data** 
- **Weather-based book recommendations** 

### Library Search System
- **Comprehensive book search** 
- **Availability checking** 

## Installation & Development Setup

### Install TypeScript Requirements
```bash
npm i -D typescript ts-node
npx tsc --init
npm init @eslint/config@latest
```

### Compile TypeScript to JavaScript
```bash
npx tsc weather.ts
npx tsc library.ts
```

## Usage

1. **Open application** via Live Server or direct HTML file
2. **Weather interaction**: Enter your city when prompted for weather-based book recommendations
3. **Library search**: Use the search form to find books by keyword
4. **Filter results**: Apply availability filters

## Technology

- **Frontend**: HTML, CSS, TypeScript/JavaScript
- **APIs**: Open-Meteo Weather API, OpenLibrary Search API
- **Weather**: `https://api.open-meteo.com/v1/forecast`
- **Books**: `https://openlibrary.org/search.json` 

- **Development Tools**: 
  - Visual Studio Code
  - TypeScript compiler
  - ESLint with recommended configurations
  - Live Server extension
- **Version Control**: Git
