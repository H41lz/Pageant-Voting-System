STEP 1:
Download:

Laravel
Composer
Xampp

STEP 2: BACKEND
Go to where you download your XAMPP Files
Open XAMPP Files => Find "htdocs"
Create Folder Name "Pageant-Voting-System" => Open the file
Go to the address bar at the top and click and type cmd
Clone the repository => git clone "https://github.com/H41lz/Pageant-Voting-System"

Step 3: BACKEND
Click "Win" on the keyboard
Type: XAMPP Control Panel => click XAMPP Control Panel
Click the "Start" Button on "Apache" and "MySQL"
Click "Admin" on the Apache
then go to phpMyAdmin

Step 4: ***MUST DO***
"Ctrl + Shift + ` "

then do this commands:
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve

STEP 5: ***MUST DO***
"Ctrl + Shift + ` "

cd Frontend_Altatech

then run this command:
npm run dev -- --host