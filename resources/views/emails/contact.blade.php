<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contactez-nous</title>
</head>
<body>
    <div>
        <h1>{{ $data['title'] }}</h1>
        <p><strong>From:</strong> {{ $data['name'] }} ({{ $data['from'] }})</p>
        <p>{{ $data['body'] }}</p>
    </div>
</body>

</html>
