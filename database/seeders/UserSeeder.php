<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'email' => 'admin@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create test users
        $users = [
            [
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
            ],
            [
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
            ],
            [
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
} 