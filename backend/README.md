# Shopki Email API Server

Backend service for sending transactional emails via SendGrid in the Aruviah e-commerce platform.

## Features

- ✅ SendGrid email integration
- ✅ Order confirmation emails
- ✅ Order status update notifications
- ✅ Beautiful HTML email templates
- ✅ Express.js RESTful API
- ✅ CORS enabled for frontend
- ✅ Error handling & logging

## Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- SendGrid account (free tier available)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure SendGrid:**
   - Sign up at https://sendgrid.com
   - Get API key from Settings → API Keys
   - Get verified sender email
   - Add to `.env`:
     ```env
     SENDGRID_API_KEY=your_api_key_here
     SENDGRID_FROM_EMAIL=your_verified_email@example.com
     PORT=3001
     ```

4. **Start server:**
   ```bash
   npm start
   ```

   Output should show:
   ```
   🚀 Email API server running on port 3001
   📧 SendGrid API Key: ✅ Configured
   📧 From Email: your_verified_email@example.com
   ```

## API Endpoints

### POST `/api/send-email`

Send an email via SendGrid.

**Request:**
```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation",
  "html": "<h1>Your Order</h1><p>...</p>",
  "text": "Optional plain text version"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email sent to customer@example.com"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Email API server is running"
}
```

## Development

### Run with Auto-Reload

```bash
npm run dev
```

Requires `nodemon` (installed as dev dependency).

### Environment Variables

```env
# SendGrid
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=support@shopki.com

# Server
PORT=3001
NODE_ENV=development
```

## Connecting Frontend

The React frontend at `../src/services/firebase/emailService.js` makes requests to this API:

```javascript
await axios.post(
  process.env.REACT_APP_API_URL + '/api/send-email',
  { to, subject, html },
  { headers: { 'Content-Type': 'application/json' } }
);
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:3001
```

## Project Structure

```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies & scripts
├── .env               # Environment variables (not committed)
├── .env.example       # Template for .env
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Dependencies

- **express** - Web framework
- **@sendgrid/mail** - SendGrid email service
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

## Error Handling

The server handles:
- Missing required fields
- Invalid email addresses
- SendGrid API errors
- Network errors

All errors are logged to console and returned as JSON responses.

## Logging

Server logs important events:
- ✅ Email sent successfully
- ❌ Email send failures
- 🚀 Server startup with configuration status

Check logs in terminal where `npm start` is running.

## Deployment

### Heroku

```bash
heroku create your-app-name
heroku config:set SENDGRID_API_KEY=your_key
heroku config:set SENDGRID_FROM_EMAIL=your_email
git push heroku main
```

### Railway.app

1. Connect GitHub repo
2. Add environment variables in dashboard
3. Auto-deploy on push

### AWS Lambda

Use AWS Lambda function with SendGrid SDK.

### Self-Hosted

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js
pm2 save
```

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Change PORT in `.env`

### Emails not sending
- Verify `SENDGRID_API_KEY` is correct
- Verify `SENDGRID_FROM_EMAIL` is verified in SendGrid
- Check SendGrid dashboard for errors
- Check server logs for error messages

### CORS errors
- Ensure frontend `REACT_APP_API_URL` matches server URL
- Check CORS middleware is enabled in `server.js`

### API Key invalid
- Go to SendGrid dashboard
- Verify API key hasn't been revoked
- Generate new API key if needed
- Update `.env` and restart server

## Testing

Send test email:

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

Check health:

```bash
curl http://localhost:3001/api/health
```

## Security Notes

- ⚠️ Never commit `.env` file
- ⚠️ Keep API keys secret
- ✅ Use environment variables
- ✅ Add API authentication for production
- ✅ Validate email addresses
- ✅ Implement rate limiting for production

## Performance

- Emails sent asynchronously via SendGrid
- Non-blocking operations
- Suitable for production use

## License

MIT

## Support

See `SENDGRID_SETUP.md` for detailed setup instructions.
