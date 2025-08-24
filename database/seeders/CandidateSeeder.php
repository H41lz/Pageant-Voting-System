<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Candidate;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = [
            [
                'name' => 'Sarah Johnson',
                'description' => 'A passionate advocate for education and community development.',
                'image' => null,
            ],
            [
                'name' => 'Maria Garcia',
                'description' => 'Dedicated to promoting cultural diversity and inclusion.',
                'image' => null,
            ],
            [
                'name' => 'Emily Chen',
                'description' => 'Environmental activist working towards sustainable solutions.',
                'image' => null,
            ],
            [
                'name' => 'Aisha Patel',
                'description' => 'Healthcare professional committed to improving public health.',
                'image' => null,
            ],
            [
                'name' => 'Jessica Williams',
                'description' => 'Technology enthusiast promoting digital literacy.',
                'image' => null,
            ],
            [
                'name' => 'Sophia Rodriguez',
                'description' => 'Artist and creative advocate for arts education.',
                'image' => null,
            ],
            [
                'name' => 'Isabella Thompson',
                'description' => 'Business leader focused on women empowerment.',
                'image' => null,
            ],
            [
                'name' => 'Olivia Davis',
                'description' => 'Sports advocate promoting fitness and wellness.',
                'image' => null,
            ],
            [
                'name' => 'Ava Martinez',
                'description' => 'Social worker dedicated to helping vulnerable communities.',
                'image' => null,
            ],
            [
                'name' => 'Mia Anderson',
                'description' => 'Scientist working on innovative research projects.',
                'image' => null,
            ],
            [
                'name' => 'Charlotte Taylor',
                'description' => 'Journalist committed to truth and transparency.',
                'image' => null,
            ],
            [
                'name' => 'Amelia Brown',
                'description' => 'Chef promoting healthy eating and food sustainability.',
                'image' => null,
            ],
            [
                'name' => 'Harper Wilson',
                'description' => 'Law student advocating for justice and equality.',
                'image' => null,
            ],
        ];

        foreach ($candidates as $candidate) {
            Candidate::create($candidate);
        }
    }
} 