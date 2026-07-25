<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ──────────────────────────────────────────────────────────────
        // 1. Super Admin (Platform Admin)
        // ──────────────────────────────────────────────────────────────
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@eduflow.com'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@eduflow.com',
                'password' => Hash::make('EduFlow@2024#SuperAdmin'),
                'role' => 'platform_admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        echo "Super Admin: admin@eduflow.com / EduFlow@2024#SuperAdmin\n";

        // ──────────────────────────────────────────────────────────────
        // 2. Institution (Approved)
        // ──────────────────────────────────────────────────────────────
        $institution = Institution::firstOrCreate(
            ['email' => 'info@demo-university.edu'],
            [
                'name' => 'Demo University',
                'slug' => 'demo-university-' . Str::random(6),
                'email' => 'info@demo-university.edu',
                'phone' => '+8801700000001',
                'address' => '123 University Avenue',
                'city' => 'Dhaka',
                'state' => 'Dhaka',
                'country' => 'Bangladesh',
                'postal_code' => '1205',
                'website' => 'https://demo-university.edu',
                'type' => 'university',
                'status' => 'active',
                'approved_at' => now(),
                'approved_by' => $superAdmin->id,
            ]
        );

        echo "Institution: {$institution->name} ({$institution->email})\n";

        // ──────────────────────────────────────────────────────────────
        // 3. Institution Admin
        // ──────────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'institution@demo-university.edu'],
            [
                'name' => 'Dr. John Smith',
                'email' => 'institution@demo-university.edu',
                'password' => Hash::make('password123'),
                'role' => 'institution_admin',
                'institution_id' => $institution->id,
                'status' => 'active',
                'phone' => '+8801700000002',
                'email_verified_at' => now(),
            ]
        );

        echo "Institution Admin: institution@demo-university.edu / password123\n";

        // ──────────────────────────────────────────────────────────────
        // 4. Teacher
        // ──────────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'teacher@demo-university.edu'],
            [
                'name' => 'Prof. Jane Doe',
                'email' => 'teacher@demo-university.edu',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'institution_id' => $institution->id,
                'status' => 'active',
                'phone' => '+8801700000003',
                'email_verified_at' => now(),
            ]
        );

        echo "Teacher: teacher@demo-university.edu / password123\n";

        // ──────────────────────────────────────────────────────────────
        // 5. Student
        // ──────────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'student@demo-university.edu'],
            [
                'name' => 'Alice Johnson',
                'email' => 'student@demo-university.edu',
                'password' => Hash::make('password123'),
                'role' => 'student',
                'institution_id' => $institution->id,
                'status' => 'active',
                'phone' => '+8801700000004',
                'student_id' => 'STU-2024-001',
                'email_verified_at' => now(),
            ]
        );

        echo "Student: student@demo-university.edu / password123\n";

        echo "\n── Seed complete ──\n";
    }
}
