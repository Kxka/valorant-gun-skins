# Testing with Playwright

This project uses Playwright for end-to-end testing to ensure all webpage functionalities work correctly.

## Setup

Playwright has been installed and configured. The configuration file is `playwright.config.ts`.

## Available Test Scripts

- `npm run test:e2e` - Run all Playwright tests in headless mode
- `npm run test:e2e:headed` - Run tests with browser visible
- `npm run test:e2e:ui` - Run tests with Playwright UI mode for debugging
- `npm run test:e2e:report` - Show the last test report

## Test Files

### `tests/navbar.spec.ts`
Tests navbar functionality including:
- ✅ Logo clickability (returns to main screen)
- ✅ Dropdown hover behavior (fixed gap issue)
- ✅ Dropdown menu visibility and content
- ✅ Responsive design on mobile
- ✅ Visual styling and hover effects

### `tests/image-fallback.spec.ts`
Tests image fallback functionality including:
- ✅ Backup image display when skin images fail to load
- ✅ Large placeholder in modal for failed images
- ✅ Placeholder image accessibility

### `tests/general.spec.ts`
Tests general application functionality including:
- Page loading and basic structure
- Modal opening and closing
- Weapon filtering
- Network failure handling
- Basic accessibility features

### `tests/example.spec.ts`
Simple example test that verifies homepage loading

## Running Tests

### Prerequisites
Make sure your development server is running:
```bash
npm start
```

### Run Tests
```bash
# Run all tests
npm run test:e2e

# Run tests with browser visible (helpful for debugging)
npm run test:e2e:headed

# Run with UI mode for interactive debugging
npm run test:e2e:ui
```

## Features Tested

### ✅ Completed Improvements Tested
1. **Backup Image for Failure Cases** - Tests verify placeholder images are used when skin images fail to load
2. **Fixed Dropdown Hover Issue** - Tests verify dropdowns stay visible when hovering between button and content
3. **Clickable Logo** - Tests verify logo click functionality returns to main screen  
4. **Improved Navbar Styling** - Tests verify enhanced visual styling and responsive design

### Test Coverage
- Navigation functionality
- Image loading and fallbacks
- Modal interactions
- Responsive design
- Hover states and animations
- Error handling
- Basic accessibility

## Test Configuration

The `playwright.config.ts` file includes:
- Multiple browser testing (Chrome, Firefox, Safari)
- Automatic screenshot capture on failures
- Test tracing for debugging
- Local development server integration
- HTML report generation

## Troubleshooting

If tests fail:
1. Ensure the development server is running on `http://localhost:3000`
2. Check if all required placeholder images exist in the `public` folder
3. Use `npm run test:e2e:headed` to see what's happening in the browser
4. Use `npm run test:e2e:ui` for interactive debugging
5. Check the generated HTML report with `npm run test:e2e:report`