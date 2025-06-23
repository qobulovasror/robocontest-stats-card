# 🚀 RoboContest & LeetCode Stats Card Generator

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1+-blue?style=for-the-badge&logo=express)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)

**Generate beautiful SVG stats cards for RoboContest and LeetCode profiles**

[![RoboContest Card Example](https://img.shields.io/badge/RoboContest-Example%20Card-blue?style=for-the-badge)](https://robocontest.uz)
[![LeetCode Card Example](https://img.shields.io/badge/LeetCode-Example%20Card-orange?style=for-the-badge)](https://leetcode.com)

</div>

---

## ✨ Features

### 🎯 **RoboContest Stats Cards**
- **Rank & Rating**: Current rank and rating with max rating tracking
- **Problem Solving**: Solved problems count with total available problems
- **Star System**: Stars earned vs total available stars
- **Programming Languages**: Top languages used with solved counts
- **Success Rate**: Overall success rate based on submissions
- **Recent Activity**: Latest problem attempts with status
- **Join Date**: Member since information
- **Theme Support**: Dark and light theme options

### 💻 **LeetCode Stats Cards**
- **Total Solved**: Complete problem count with difficulty breakdown
- **Global Ranking**: Current ranking among all users
- **Acceptance Rate**: Success rate percentage
- **Difficulty Stats**: Easy, Medium, Hard problem counts
- **Reputation**: Community reputation score
- **Star Rating**: Contest performance stars
- **Badges**: Active badges and achievements
- **Country**: User's country information

### 🎨 **Design Features**
- **SVG Format**: Scalable vector graphics for crisp display
- **Responsive Design**: Adapts to different sizes
- **Gradient Backgrounds**: Beautiful color schemes
- **Progress Bars**: Visual progress indicators
- **Custom Themes**: Dark and light mode support
- **Caching**: 1-hour cache for optimal performance

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/robocontest-stats-card.git
   cd robocontest-stats-card
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the application**
   ```
   http://localhost:3000
   ```

---

## 📖 Usage

### RoboContest Stats Card

#### Basic Usage
```
GET /cards/robocontest/{username}
```

#### Parameters
- `username` (required): RoboContest username
- `theme` (optional): `dark` or `light` (default: `dark`)
- `extension_type` (optional): `card` or `card_attempts` (default: `card`)

#### Examples

**Basic Card:**
```
http://localhost:3000/cards/robocontest/qobulovasror
```

**Light Theme:**
```
http://localhost:3000/cards/robocontest/qobulovasror?theme=light
```

**Attempts Card:**
```
http://localhost:3000/cards/robocontest/qobulovasror?extension_type=card_attempts
```

### LeetCode Stats Card

#### Basic Usage
```
GET /cards/leetcode/{username}
```

#### Parameters
- `username` (required): LeetCode username

#### Example
```
http://localhost:3000/cards/leetcode/qobulovasror
```

---

## 🎨 Card Examples

### RoboContest Card
![RoboContest Card](https://via.placeholder.com/495x240/1a1a1a/ffffff?text=RoboContest+Stats+Card)

**Features displayed:**
- User rank and rating
- Solved problems (X/Y format)
- Stars earned
- Top programming languages
- Success rate percentage
- Recent activity preview
- Join date

### LeetCode Card
![LeetCode Card](https://via.placeholder.com/495x195/1a1a1a/ffffff?text=LeetCode+Stats+Card)

**Features displayed:**
- Total problems solved
- Global ranking
- Acceptance rate
- Difficulty breakdown (Easy/Medium/Hard)
- Reputation score
- Star rating
- Active badges

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### Customization

#### Themes
The cards support two themes:
- **Dark Theme** (default): Modern dark appearance
- **Light Theme**: Clean light appearance

#### Card Types
- **Standard Card**: Main stats overview
- **Attempts Card**: Detailed submission history

---

## 🏗️ Project Structure

```plaintext
robocontest-stats-card/
├── config/                 # Configuration files
│   ├── dirname.js         # Directory path utilities
│   └── logger.js          # Winston logger setup
├── controllers/           # Route controllers
├── middlewares/           # Express middlewares
│   └── customError.js     # Error handling middleware
├── public/               # Static assets
│   ├── imgs/            # Images
│   └── index.html       # Main page
├── routes/              # API routes
│   ├── homeRoutes.js    # Home page routes
│   ├── leetcode.js      # LeetCode card routes
│   ├── robocontest.js   # RoboContest card routes
│   └── notFoundRoutes.js # 404 handling
├── services/            # Business logic
│   ├── leetcodeService.js    # LeetCode API integration
│   └── robocontestService.js # RoboContest scraping
├── startup/             # Application startup
│   ├── init.js          # Express app initialization
│   └── routes.js        # Route registration
├── views/               # EJS templates
│   ├── leetcode-card.ejs     # LeetCode card template
│   └── robocontest/          # RoboContest templates
│       ├── card.ejs          # Main card template
│       ├── card-activity.ejs # Activity card template
│       └── card-attempts.ejs # Attempts card template
├── index.js             # Application entry point
└── package.json         # Dependencies and scripts
```

---

## 🚀 Deployment

### Heroku
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📝 API Documentation

### RoboContest API

#### GET `/cards/robocontest/{username}`
Generate RoboContest stats card.

**Parameters:**
- `username` (path): RoboContest username
- `theme` (query): Card theme (`dark`|`light`)
- `extension_type` (query): Card type (`card`|`card_attempts`)

**Response:**
- Content-Type: `image/svg+xml`
- Cache-Control: `public, max-age=3600`

### LeetCode API

#### GET `/cards/leetcode/{username}`
Generate LeetCode stats card.

**Parameters:**
- `username` (path): LeetCode username

**Response:**
- Content-Type: `image/svg+xml`
- Cache-Control: `public, max-age=3600`

---

## 🐛 Troubleshooting

### Common Issues

**Card not generating:**
- Verify username exists on the platform
- Check network connectivity
- Review server logs for errors

**Slow response times:**
- Cards are cached for 1 hour
- First request may be slower due to data fetching

**Styling issues:**
- Ensure SVG is properly embedded
- Check browser compatibility

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **RoboContest**: For providing the competitive programming platform
- **LeetCode**: For their excellent coding platform and API
- **Express.js**: For the robust web framework
- **EJS**: For the templating engine
- **SVG**: For scalable vector graphics support

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/qobulovasror/robocontest-stats-card/issues)
- **Discussions**: [GitHub Discussions](https://github.com/qobulovasror/robocontest-stats-card/discussions)
- **Email**: qobulovasror0@gmail.com

---

<div align="center">

**Made with ❤️ by [Qobulov Asror](https://github.com/qobulovasror)**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-blue?style=social&logo=github)](https://github.com/qobulovasror)

</div>
