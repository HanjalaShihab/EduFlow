<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::firstOrCreate(
    ['email' => 'admin@eduflow.com'],
    [
        'name' => 'Super Admin',
        'password' => Hash::make('EduFlow@2024#SuperAdmin'),
        'role' => 'platform_admin',
        'status' => 'active',
        'email_verified_at' => now(),
    ]
);

echo "Super Admin: " . ($user->wasRecentlyCreated ? "CREATED" : "ALREADY EXISTS") . "\n";
echo "Email: admin@eduflow.com\n";
echo "Name: " . $user->name . "\n";
echo "Role: " . $user->role . "\n";
echo "Status: " . $user->status . "\n";

$check = Hash::check('EduFlow@2024#SuperAdmin', $user->password);
echo "Password check: " . ($check ? "PASS" : "FAIL") . "\n";

if (!$check) {
    $user->password = Hash::make('EduFlow@2024#SuperAdmin');
    $user->save();
    echo "Password re-hashed and saved.\n";
}
