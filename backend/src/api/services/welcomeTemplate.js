exports.welcome = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Review Agreement</title>
    <style>
        /* General styles */
        body {
            font-family: Inter, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }

        .email-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #4f46e5;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .email-header h1 {
            color: white;
            margin: 0;
        }

        .email-body {
            padding: 30px;
            text-align: center;
            color: #333;
        }

        .email-body h2 {
            color: #333;
            margin-bottom: 20px;
        }

        .email-body p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .action-btn {
            text-decoration: none;
            padding: 12px 30px;
            font-size: 18px;
            color: white;
            background-color: #4f46e5;
            border-radius: 5px;
            border: none;
            display: inline-block;
            transition: background-color 0.3s ease;
        }

        .action-btn:link,
        .action-btn:visited,
        .action-btn:hover,
        .action-btn:active {
            text-decoration: none;
            color: white;
        }

        .email-footer {
            padding: 20px;
            text-align: center;
            background-color: #f1f1f1;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        .email-footer p {
            color: #777;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Email Header -->
        <div class="email-header">
            <h1>Invitation to Review Agreement</h1>
        </div>

        <!-- Email Body -->
        <div class="email-body">
            <h2>Hello [Recipient Name],</h2>
            <p><strong>[Creator Name]</strong> has invited you to review the agreement titled <strong>[Agreement Title]</strong>.</p>
            <p>Click the button below to view and review the agreement. Make sure to sign in using this email address (<strong>[Recipient Email]</strong>) to access the document.</p>
            <a href="[Agreement Review Link]" class="action-btn">View Agreement</a>
        </div>

        <!-- Email Footer -->
        <div class="email-footer">
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@yourapp.com" style="color: #4f46e5;">support@vighnotech.com</a>.</p>
            <p>&copy; [Year] YourAppName. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`;
