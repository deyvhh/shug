<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>login</title>
</head>
<body>
    <form action="/login" method="POST">
        <input type="text" name="login">
        <input type="password" name="password">
        <input type="submit" value="Login">
        <?php
        if(getVar("error") !== null){
            echo "<p style='color: red'>".getVar("error")."</p>";
        }
        ?>
    </form>
</body>
</html>