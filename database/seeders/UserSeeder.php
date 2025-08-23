<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user (check if exists first)
        User::firstOrCreate(
            ['email' => 'admin@pageant.com'],
            [
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

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

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'password' => $userData['password'],
                    'role' => $userData['role'],
                ]
            );
        }
    }
}