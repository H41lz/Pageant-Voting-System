<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pageant Voting System</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <div id="root"></div>
    
    <!-- Load React App -->
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module" src="http://localhost:5173/src/main.jsx"></script>
</body>
</html> 