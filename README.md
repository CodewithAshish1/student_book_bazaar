📚 Student Book Bazaar

A modern, responsive web application for students to buy and sell second-hand books within their campus community.

🌟 Features
Core Functionality

📖 Post Book Ads - List your books with title, author, price, condition, category, description, contact info, and image
🔍 Smart Search - Real-time search by title or author
🎛️ Advanced Filters - Filter by category, condition, and price range
📊 Multiple Sort Options - Sort by latest, price (low to high), or price (high to low)
💾 Local Storage - All data persists after page reload
📱 Fully Responsive - Works seamlessly on mobile, tablet, and desktop

Enhanced Features

❤️ Wishlist System - Save books for later viewing
🌓 Dark Mode - Toggle between light and dark themes with smooth transitions
📋 Grid/List View - Switch between card grid and detailed list views
♾️ Pagination - Load more button for better performance with large datasets
✅ Confirmation Modals - Safe delete operations with user confirmation
🎨 Modern UI/UX - Beautiful gradient backgrounds, hover animations, and smooth transitions
📞 Contact Seller - Direct contact information access
🗑️ Delete Listings - Remove your own book posts
🔔 Toast Notifications - User-friendly feedback for all actions

Categories Supported

📐 Engineering
🔬 Science
💼 Commerce
🎨 Arts
📚 Novels
⚕️ Medical
📦 Other

🚀 Demo
Live Demo | Screenshots
📸 Screenshots
Home Page
Show Image
Dark Mode
Show Image
Book Listing
Show Image
Wishlist
Show Image
🛠️ Installation
Prerequisites

A modern web browser (Chrome, Firefox, Safari, Edge)
A text editor (VS Code, Sublime Text, etc.) - optional

Quick Start

Clone the repository

bash   git clone https://github.com/CodewithAshish/student-book-bazaar.git
   cd student-book-bazaar

Open the project

bash   # Simply open index.html in your browser
   # Or use a local server (recommended)

Using Live Server (Recommended)

bash   # If you have VS Code with Live Server extension
   # Right-click on index.html and select "Open with Live Server"
   
   # Or use Python's built-in server
   python -m http.server 8000
   # Then visit http://localhost:8000

Start using the app! 🎉

📂 Project Structure
student-book-bazaar/
│
├── index.html          # Main HTML structure
├── styles.css          # All styles and animations
├── script.js           # Application logic and functionality
├── README.md           # Project documentation
└── LICENSE             # MIT License
💻 Usage
Posting a Book

Click the "Post Ad" button in the navigation bar
Fill in the book details:

Title (required)
Author (required)
Category (required)
Condition (required)
Price in ₹ (required)
Description (optional)
Contact Number (required)
Image URL (optional - defaults to placeholder)


Click "Post Ad" to publish

Searching and Filtering

Use the search bar to find books by title or author
Select category from dropdown
Choose book condition
Set price range using min/max inputs
Sort results by latest, price low-to-high, or price high-to-low

Managing Wishlist

Click the heart icon on any book card to add/remove from wishlist
Access wishlist via the heart icon in navigation
View all saved books in one place
Remove items directly from wishlist

Dark Mode

Toggle dark mode using the moon/sun icon in navigation
Preference is saved and persists across sessions

🎨 Customization
Changing Colors
Edit the CSS variables in styles.css:
css:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #f59e0b;
    /* Add more custom colors */
}
Adding New Categories
Update the category options in index.html:
html<option value="YourCategory">Your Category</option>
Modifying Items Per Page
Change the pagination limit in script.js:
javascriptconst itemsPerPage = 9; // Change to your preferred number
🔧 Technologies Used
TechnologyPurposeHTML5Structure and semantic markupCSS3Styling, animations, and responsive designJavaScript (ES6+)Application logic and interactivityLocal Storage APIData persistenceFont AwesomeIconsGoogle FontsTypography (Poppins)
🌐 Browser Support
BrowserSupported VersionsChrome✅ Latest 2 versionsFirefox✅ Latest 2 versionsSafari✅ Latest 2 versionsEdge✅ Latest 2 versionsOpera✅ Latest 2 versions
📱 Responsive Breakpoints

Mobile: < 480px
Tablet: 481px - 768px
Desktop: > 768px

🤝 Contributing
Contributions are what make the open source community amazing! Any contributions you make are greatly appreciated.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

Contribution Ideas

 User authentication system
 Image upload functionality
 Chat system between buyers and sellers
 Rating and review system
 Email notifications
 Advanced analytics dashboard
 Export/Import data functionality
 Social media sharing
 Multi-language support
 Payment integration

🐛 Known Issues

Image URLs must be valid and publicly accessible
Local storage has a size limit (~5-10MB depending on browser)
No backend - data is stored locally only

🔮 Future Enhancements

🔐 User authentication and profiles
📤 Direct image upload support
💬 In-app messaging system
⭐ Ratings and reviews
🔔 Email/SMS notifications
🗺️ Location-based filtering
💳 Payment gateway integration
📊 Analytics dashboard
🌍 Multiple campus support

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
MIT License

Copyright (c) 2025 ashish singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
👨‍💻 Author
ashish singh

GitHub: @CodewithAshish
LinkedIn: 
Email: ashish241438@gmail.com

🙏 Acknowledgments

Design inspiration from OLX and modern e-commerce platforms
Icons by Font Awesome
Fonts by Google Fonts
Images from Unsplash
Community feedback and contributions

📞 Support
If you have any questions or need help, feel free to:

Open an issue on GitHub
Send an email to support@bookbazaar.com
Join our community discussions

⭐ Show Your Support
Give a ⭐️ if this project helped you!

<p align="center">Made with ❤️ for students, by students</p>
<p align="center">
  <a href="#top">Back to Top ⬆️</a>
</p>
