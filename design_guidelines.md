# Design Guidelines: Student Reading Speed Tracker

## Design Approach
**Utility-Focused Design System Approach** - Using a clean, functional design inspired by educational productivity tools like Google Classroom and Notion, prioritizing efficiency and ease of use for teachers during active testing sessions.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light mode: Clean blues (210 85% 45%) for primary actions, neutral grays (220 10% 95%) for backgrounds
- Dark mode: Softer blues (210 60% 65%) with dark backgrounds (220 15% 12%)

**Semantic Colors:**
- Success/Progress: Green (145 65% 45%) for positive trends
- Warning/Needs Attention: Amber (45 85% 55%) for students requiring focus
- Background: Very light gray (220 15% 98%) in light mode, dark gray (220 15% 8%) in dark mode

### B. Typography
**Font Family:** Inter or system fonts via Google Fonts
- Headers: 600 weight for section titles
- Body: 400 weight for general text
- Data/Numbers: 500 weight for WPM scores and statistics
- Small labels: 400 weight, slightly reduced size

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 2, 4, 6, and 8 units
- Tight spacing (p-2, m-2) for compact data displays
- Medium spacing (p-4, gap-4) for form elements and cards
- Generous spacing (p-6, p-8) for main content sections

### D. Component Library

**Student Selection Interface:**
- Prominent "Select Next Student" dropdown/modal at top of dashboard
- Student cards showing name, last test date, and recent WPM trend indicator
- Filter buttons for "Last Tested," "Best Progress," and "Worst Progress" views

**Test Recording Form:**
- Large, focused WPM input field with clear numeric styling
- Date picker (defaulting to today)
- Quick "Record Test" action button
- Visual confirmation of successful test recording

**Progress Visualization:**
- Clean line chart showing WPM over time using a charting library
- Trend indicators (up/down arrows) next to student names
- Progress percentage calculations displayed prominently

**Student Management:**
- Simple student cards with essential info (name, total tests, latest WPM)
- Search functionality for large class sizes
- Add new student form with minimal required fields

**Data Display:**
- Tabular test history with sortable columns
- Visual progress indicators (small charts or progress bars)
- Summary statistics prominently displayed

### E. Layout Structure
**Single-page dashboard design** with clear sections:
1. Quick actions header (student selection, new test recording)
2. Student overview with filtering options
3. Selected student detail panel with chart and history
4. Minimal, contextual navigation

**Responsive Design:**
- Tablet-optimized for classroom use
- Mobile support for on-the-go testing
- Large touch targets for quick interaction

## Key Design Principles
1. **Speed of Use:** Minimize clicks to record a new test
2. **Visual Clarity:** Easy scanning of student progress at a glance
3. **Data Focus:** Charts and numbers are the primary interface elements
4. **Teacher-Friendly:** Familiar educational software patterns and terminology
5. **Accessibility:** High contrast ratios and clear text for various classroom lighting conditions