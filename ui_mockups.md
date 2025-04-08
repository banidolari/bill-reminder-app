# Bill Reminder Application UI Mockups

This document describes the key screens and user interface elements for the Bill Reminder Application.

## Key Screens

### 1. Login/Registration Screen

**Login Section:**
- Email input field
- Password input field
- "Remember me" checkbox
- Login button
- "Forgot password?" link
- "Register" link for new users

**Registration Section:**
- Name input field
- Email input field
- Password input field
- Confirm password input field
- Terms and conditions checkbox
- Register button

### 2. Dashboard Screen

**Header:**
- App logo
- User profile icon/dropdown
- Notifications bell icon

**Summary Section:**
- Total bills due this month
- Amount due this month
- Paid vs. unpaid bills ratio (visual chart)
- Quick action buttons (Add bill, View all)

**Upcoming Bills Section:**
- List of bills due in the next 7 days
- Each bill shows:
  - Bill name
  - Amount
  - Due date
  - Category (with color indicator)
  - Status indicator (paid/unpaid)
  - Quick "Mark as paid" button

**Monthly Overview:**
- Calendar view showing bill due dates
- Color-coded by category
- Visual indicators for paid/unpaid status

**Recent Activity:**
- List of recently paid bills or added bills
- Timestamp for each activity

### 3. Bills List Screen

**Filtering Options:**
- Status filter (All, Paid, Unpaid, Overdue)
- Category filter
- Date range filter
- Amount range filter

**Sorting Options:**
- Sort by due date
- Sort by amount
- Sort by name
- Sort by category

**Bills List:**
- Each bill shows:
  - Bill name
  - Amount
  - Due date
  - Category
  - Status
  - Action buttons (Edit, Delete, Mark as paid)
- Pagination controls

**Add Bill Button:**
- Floating action button in bottom right

### 4. Add/Edit Bill Screen

**Bill Details Form:**
- Bill name input
- Amount input
- Due date picker
- Category dropdown (with option to add new)
- Payment method input
- Notes textarea
- Recurrence options:
  - One-time
  - Daily
  - Weekly
  - Monthly
  - Quarterly
  - Annually
- End recurrence options (if recurring)

**Notification Settings:**
- Enable/disable notifications
- Notification type (email, in-app, both)
- Days before due date to notify

**Action Buttons:**
- Save button
- Cancel button
- Delete button (for edit mode)

### 5. Categories Management Screen

**Categories List:**
- Each category shows:
  - Name
  - Color indicator
  - Number of bills in category
  - Action buttons (Edit, Delete)

**Add Category Section:**
- Category name input
- Color picker
- Icon selector
- Add button

### 6. Settings Screen

**Profile Settings:**
- Name
- Email
- Password change option
- Profile picture upload

**Notification Preferences:**
- Default notification type
- Default notification timing
- Email notification toggle
- In-app notification toggle

**Display Preferences:**
- Theme selection (Light/Dark)
- Currency format
- Date format

**Account Actions:**
- Export data option
- Delete account option

### 7. Reports Screen

**Time Period Selector:**
- This month
- Last month
- Last 3 months
- Last 6 months
- Custom date range

**Summary Statistics:**
- Total bills paid
- Total amount paid
- Average monthly expenses
- Highest bill amount

**Charts and Visualizations:**
- Monthly expenses trend line
- Category breakdown pie chart
- Payment status distribution
- Bill frequency by day of month

**Detailed Reports:**
- Tabular data with all bills in selected period
- Export options (CSV, PDF)

## Mobile Responsive Adaptations

### Small Screen Adaptations:

**Navigation:**
- Bottom navigation bar instead of sidebar
- Collapsible header
- Hamburger menu for additional options

**Dashboard:**
- Stacked card layout instead of grid
- Swipeable sections
- Reduced information density

**Lists:**
- Simplified list items
- Swipe actions for mark as paid/delete
- Infinite scroll instead of pagination

**Forms:**
- Full-screen modal forms
- Step-by-step input process for complex forms
- Optimized input controls for touch

## UI Components and Design Elements

### Color Scheme:
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #F59E0B (Amber)
- Danger: #EF4444 (Red)
- Background: #F9FAFB (Light Gray)
- Text: #1F2937 (Dark Gray)
- White: #FFFFFF

### Typography:
- Headings: Inter, sans-serif
- Body: Inter, sans-serif
- Monospace: Roboto Mono (for amounts)

### UI Components:
- Cards with subtle shadows
- Rounded corners (8px radius)
- Toggle switches for binary options
- Dropdown menus for selection
- Date pickers with calendar view
- Progress indicators
- Toast notifications
- Modal dialogs
- Tooltips for additional information

### Interactive Elements:
- Buttons with hover/active states
- Form inputs with focus states
- Checkboxes and radio buttons
- Sliders for range selection
- Drag and drop for reordering
- Swipe actions on mobile

### Accessibility Considerations:
- High contrast mode
- Screen reader compatibility
- Keyboard navigation support
- Touch targets sized appropriately (min 44px)
- Focus indicators
- Alternative text for visual elements
