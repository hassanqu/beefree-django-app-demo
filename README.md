# Django Beefree SDK Demo

A modern Django application that integrates the [Beefree SDK](https://docs.beefree.io/beefree-sdk) email editor using a contemporary frontend build process with Vite and npm.

## 🚀 Features

- **Modern Frontend Build**: Uses Vite for fast builds and hot reloading
- **npm Package Management**: Proper dependency management with `@beefree.io/sdk`
- **Responsive Design**: Full-screen editor with modern CSS
- **Secure Token Handling**: Server-side token generation for BeeFree SDK
- **Development Workflow**: Hot reloading for both frontend and backend

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm 9+**
- **BeeFree Account**: Get your `BEE_CLIENT_ID` and `BEE_CLIENT_SECRET` from [BeeFree](https://beefree.io/)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/BeefreeSDK/beefree-django-app-demo.git
cd Django-beefree-demo
```

### 2. Set Up Python Environment
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Set Up Frontend Build
```bash
# Install npm dependencies
npm install

# Install Beefree SDK package
npm install @beefree.io/sdk

# Build frontend assets
npm run build
```

### 4. Configure Environment Variables
Create a `.env` file in the project root:
```bash
# Django settings
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=*

# BeeFree credentials
BEE_CLIENT_ID=your-bee-client-id
BEE_CLIENT_SECRET=your-bee-client-secret
```

### 5. Run Database Migrations
```bash
python manage.py migrate
```

### 6. Start the Application
```bash
python manage.py runserver
```

Visit `http://localhost:8000/` to see the application!

## 🎯 Quick Start Script

For convenience, use the provided build script:
```bash
./build.sh
```

This script will:
- Check Node.js version
- Install npm dependencies
- Install Beefree SDK package
- Build frontend assets
- Provide next steps

## 🔧 Development

### Frontend Development with Hot Reloading
```bash
# Terminal 1: Start Django server
python manage.py runserver

# Terminal 2: Start Vite dev server
npm run dev
```

The Vite dev server will run on `http://localhost:3000` with hot reloading and proxy API requests to Django on `http://localhost:8000`.

### Available Scripts
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

## 📁 Project Structure

```
Django-beefree-demo/
├── beefree_demo/           # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── editor/                 # Django app
│   ├── views.py           # API endpoints and views
│   ├── urls.py            # URL routing
│   └── apps.py
├── frontend/              # Frontend source code
│   ├── src/
│   │   ├── editor.js      # Main editor logic
│   │   └── styles.css     # Modern CSS styles
│   └── index.html         # Development template
├── templates/             # Django templates
│   └── editor/
│       └── index.html     # Production template
├── static/                # Built assets (generated)
│   ├── js/
│   └── css/
├── package.json           # npm dependencies
├── vite.config.js         # Vite build configuration
├── requirements.txt       # Python dependencies
├── manage.py             # Django management
└── README.md
```

## 🔌 How It Works

### Architecture Overview

1. **Django Backend**: Handles authentication and serves the main page
2. **BeeFree API**: Securely generates tokens server-side
3. **Frontend Build**: Vite bundles the BeeFree SDK and custom code
4. **Browser**: Loads the editor and handles user interactions

### Key Components

#### Django Views (`editor/views.py`)
- `index`: Renders the main editor page
- `bee_auth`: POST endpoint that generates BeeFree tokens

#### Frontend (`frontend/src/editor.js`)
- Imports `@beefree.io/sdk` from npm
- Fetches authentication token from Django
- Initializes the Beefree editor with full-screen layout
- Handles save events and error states

#### Build Process
- **Vite**: Bundles JavaScript and CSS with optimizations
- **Static Files**: Outputs to Django's static directory
- **Development**: Hot reloading and API proxying

## 🎨 Customization

### Modifying the Template
Edit the `initialTemplate` object in `frontend/src/editor.js` to change the default email template.

### Styling
Modify `frontend/src/styles.css` to customize the layout and appearance.

### Beefree SDK Configuration
Adjust the `beeConfig` object in `frontend/src/editor.js` to customize the editor behavior.

## 🔒 Security

- **Environment Variables**: Never commit `.env` files
- **Token Generation**: Always generate Beefree SDK tokens server-side
- **CORS**: Configured for local development only
- **Dependencies**: Regularly update npm and pip packages

## 🐛 Troubleshooting

### Common Issues

**Editor not loading:**
- Check browser console for errors
- Verify Beefree SDK credentials in `.env`
- Ensure `npm run build` completed successfully
- Verify `@beefree.io/sdk` package is installed

**Static files not found:**
- Run `npm run build` to generate assets
- Check that Django's `STATIC_URL` is configured correctly

**Build errors:**
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install`
- Ensure `@beefree.io/sdk` package is installed
- Check for dependency conflicts

**Token errors:**
- Verify `BEE_CLIENT_ID` and `BEE_CLIENT_SECRET` in `.env`
- Restart Django server after changing environment variables

### Development Tips

- Use browser dev tools to inspect network requests
- Check Django logs for server-side errors
- Use `npm run dev` for frontend development with hot reloading

## 📚 Resources

- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk)
- [Django Documentation](https://docs.djangoproject.com/)
- [Vite Documentation](https://vitejs.dev/)
- [BeeFree Platform](https://beefree.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.